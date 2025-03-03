import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
  Checkbox,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  LinearProgress, // <-- import the progress bar
} from '@mui/material';
import { connect } from 'react-redux';
import { Task, TaskStatus } from '../../types';
import { statusColors } from '../../utils/colors';
import {
  getTasksThunk,
  removeTaskThunk,
  updateTaskThunk,
  createTaskThunk,
} from '../../store/slices/taskSlice';
import styles from './List.module.scss';
import AddTaskForm from '../forms/AddTaskForm';
import OrderStepsTable, { StepsByTask, StepRow, OrderNotes } from '../tables/OrderNotesTable';

// Default steps for each task
const defaultRows: StepRow[] = [
  { id: 1, step: 'PAYMENT PROCESSED', date: '', by: '', notes: '' },
  { id: 2, step: 'Order Placed', date: '', by: '', notes: '' },
  { id: 3, step: 'Order Checked', date: '', by: '', notes: '' },
  { id: 4, step: 'Vendor Confirmation Checked', date: '', by: '', notes: '' },
  { id: 5, step: 'Graphics Sent to Vendor', date: '', by: '', notes: '' },
  { id: 6, step: 'Vendor Proof Sent to Client', date: '', by: '', notes: '' },
  { id: 7, step: 'Client Approval Sent to Vendor', date: '', by: '', notes: '' },
  { id: 8, step: 'Order Shipped', date: '2/17', by: '', notes: '' },
  { id: 9, step: 'Pictures Sent to Client', date: '', by: '', notes: '' },
];

// Initialize steps for each task ID
function createInitialData(count: number): StepsByTask {
  const result: StepsByTask = {};
  for (let i = 1; i <= count; i++) {
    result[i.toString()] = defaultRows.map((row) => ({ ...row }));
  }
  return result;
}

// All possible statuses
const ALL_STATUSES: TaskStatus[] = [
  'Paid',
  'In Progress',
  'Completed',
  'On Hold',
  'Canceled',
  'Approved',
  'Order from Vendor Confirmed',
  'Order Checked',
  'Order Placed',
];

const List: React.FC<{
  tasks: Task[];
  getTasks: (page: number, limit: number) => void;
  removeTask: (taskId: number) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Task) => void;
}> = ({ tasks, getTasks, removeTask, updateTask, addTask }) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  // For paste functionality
  const [pastedData, setPastedData] = useState<{ [key: number]: string }>({});
  const [pastedImages, setPastedImages] = useState<{ [key: number]: string[] }>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Steps and Notes dictionaries
  const [stepsByTask, setStepsByTask] = useState<StepsByTask>(createInitialData(tasks.length));
  const [notesByTask, setNotesByTask] = useState<{ [taskId: string]: OrderNotes }>({});

  // For Add Task dialog
  const initialValues: Task = {
    id: parseInt(
      uuidv4()
        .replace(/[^0-9]/g, '')
        .slice(0, 10),
      10
    ),
    title: '',
    ship: '',
    art: '',
    inHand: '',
    dueDate: '',
    status: [],
    priority: '' as 'High' | 'Medium' | 'Low',
  };

  // Open/close the Add Task dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Submit new task
  const handleSubmit = (values: Task, formikBag: any) => {
    try {
      addTask(values);
    } catch (error) {
      console.error('Error adding task:', error);
    }
    formikBag.resetForm();
    handleClose();
  };

  // Paste functionality
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    const { items } = e.clipboardData;

    // 1) Check for images
    for (const item of items) {
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setPastedImages((prev) => ({
              ...prev,
              [selectedTask.id]: [...(prev[selectedTask.id] || []), event.target?.result as string],
            }));
          };
          reader.readAsDataURL(file);
        }
        return;
      }
    }

    // 2) Check for HTML content
    const htmlData = e.clipboardData.getData('text/html');
    if (htmlData) {
      setPastedData((prev) => ({
        ...prev,
        [selectedTask.id]: htmlData,
      }));
      return;
    }

    // 3) Otherwise, plain text
    const textData = e.clipboardData.getData('text');
    setPastedData((prev) => ({
      ...prev,
      [selectedTask.id]: textData,
    }));
  };

  // Fetch tasks on mount or pagination changes
  useEffect(() => {
    getTasks(currentPage, itemsPerPage);
  }, [getTasks, currentPage, itemsPerPage]);

  // Check/uncheck tasks
  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  useEffect(() => {
    setStepsByTask((prev) => {
      const newStepsByTask = { ...prev };

      tasks.forEach((task) => {
        const taskIdStr = task.id.toString();
        // If this task doesn't have an entry yet, create a default one
        if (!newStepsByTask[taskIdStr]) {
          newStepsByTask[taskIdStr] = defaultRows.map((row) => ({ ...row }));
        }
      });

      return newStepsByTask;
    });
  }, [tasks]);

  // Bulk delete
  const handleDeleteSelected = () => {
    selectedTasks.forEach((taskId) => {
      removeTask(taskId);
    });
    setSelectedTasks([]);
  };

  // Bulk mark “Completed”
  const handleSuccessSelected = () => {
    selectedTasks.forEach((taskId) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const updatedStatus = task.status.includes('Completed')
        ? task.status
        : [...task.status, 'Completed'];

      const updatedTask: Task = {
        ...task,
        status: updatedStatus as TaskStatus[],
      };
      updateTask(updatedTask);
      setSelectedTask(updatedTask);
    });
  };

  // Row click selects a single task
  const handleRowClick = (task: Task) => {
    setSelectedTask((prev) => (prev?.id === task.id ? null : task));
  };

  // Filter tasks by search
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  // Early return if no tasks
  if (!tasks.length) {
    return <Typography variant="h6">No tasks available</Typography>;
  }

  // =========== TWO-BOX STATUS LOGIC ===========
  // 1) The task's currently selected statuses
  const selectedStatuses = selectedTask?.status || [];

  // 2) The unselected statuses
  const unselectedStatuses = ALL_STATUSES.filter((s) => !selectedStatuses.includes(s));

  // 3) Handlers to add/remove a status
  const handleAddStatus = (status: TaskStatus) => {
    if (!selectedTask) return;
    const newStatuses = [...selectedTask.status, status];
    const updatedTask: Task = { ...selectedTask, status: newStatuses };
    setSelectedTask(updatedTask);
    updateTask(updatedTask);
  };

  const handleRemoveStatus = (status: TaskStatus) => {
    if (!selectedTask) return;
    const newStatuses = selectedTask.status.filter((s) => s !== status);
    const updatedTask: Task = { ...selectedTask, status: newStatuses };
    setSelectedTask(updatedTask);
    updateTask(updatedTask);
  };

  const handleSaveTask = () => {
    console.log("Saving task...");
  }
  // ============================================

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      gap={2}
      sx={{ backgroundColor: '#fff' }}
    >
      {/* SEARCH FIELD */}
      <Box display="flex" justifyContent="center" gap={3}>
        <TextField
          label="Search Tasks"
          variant="standard"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: '500px' }}
          className={styles.searchTask}
        />
      </Box>

      {/* ADD TASK BUTTON */}
      <Box display="flex" justifyContent="center" gap={3}>
        <Button
          variant="contained"
          color="success"
          onClick={handleOpen}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        >
          Add New Task
        </Button>
      </Box>

      {/* ADD TASK DIALOG */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <AddTaskForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>

      {/* BULK ACTIONS */}
      {tasks.length > 0 && selectedTasks.length > 0 && (
        <Box display="flex" justifyContent="center" gap={3}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            sx={{ alignSelf: 'flex-start', mb: 2 }}
          >
            Delete Selected ({selectedTasks.length})
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleSuccessSelected}
            sx={{ alignSelf: 'flex-start', mb: 2 }}
          >
            Success Selected ({selectedTasks.length})
          </Button>
        </Box>
      )}

      <Box display="flex" flexDirection="column" justifyContent="center" gap={3}>
        {/* ========== TASK TABLE ========== */}
        <Box display="flex" justifyContent="center" gap={3} sx={{ mt: 2 }}>
          <Box>
            <TableContainer component={Paper} sx={{ maxWidth: 900, flex: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.length === tasks.length && tasks.length > 0}
                        onChange={() =>
                          setSelectedTasks(
                            selectedTasks.length === tasks.length
                              ? []
                              : tasks.map((task) => task.id)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Title</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Art</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>In Hand</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Ship</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Due Date</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      onClick={() => handleRowClick(task)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedTask?.id === task.id ? '#f0f0f0' : 'transparent',
                        textDecoration: task.status.includes('Completed') ? 'line-through' : 'none',
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleCheckboxChange(task.id)}
                        />
                      </TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{task.ship}</TableCell>
                      <TableCell>{task.art}</TableCell>
                      <TableCell>{task.inHand}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {task.status.map((status) => (
                            <Box key={status} display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '3px',
                                  backgroundColor: statusColors[status],
                                }}
                              />
                              <Typography variant="body2">{status}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          {/* ========== RIGHT SIDE: SELECTED TASK DETAILS ========== */}
          <Box>
            {selectedTask && (
              <>
                <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    onClick={handleSaveTask} 
                  >
                    Save Task
                  </Button>
                </Box>
                {/* Top info section */}
                <Box
                  minHeight="200px"
                  p={2}
                  component={Paper}
                  sx={{
                    flexShrink: 0,
                    boxShadow: 3,
                    borderRadius: 2,
                    border: '1px solid #ddd',
                    backgroundColor: '#fff',
                  }}
                >
                  <Typography variant="h6">{selectedTask.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Due Date: {selectedTask.dueDate}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Priority: {selectedTask.priority}
                  </Typography>

                  {/* TWO-BOX STATUS UI */}
                  <Box mt={2}>
                    <Typography variant="subtitle1" gutterBottom>
                      Status (Click to remove)
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                      {selectedStatuses.map((status) => (
                        <Button
                          key={status}
                          variant="contained"
                          sx={{
                            backgroundColor: statusColors[status],
                            color: '#fff',
                          }}
                          onClick={() => handleRemoveStatus(status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </Box>

                    {/* ====== PROGRESS BAR ====== */}
                    <Typography variant="subtitle1" gutterBottom>
                      Progress Bar
                    </Typography>
                    {(() => {
                      // total statuses vs. how many are selected
                      const totalStatuses = ALL_STATUSES.length; // e.g. 5
                      const doneStatuses = selectedStatuses.length;
                      const progressPercent = Math.round((doneStatuses / totalStatuses) * 100);

                      return (
                        <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ flex: 1 }}>
                              <LinearProgress variant="determinate" value={progressPercent} />
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {progressPercent}%
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })()}

                    <Typography variant="subtitle1" gutterBottom>
                      Add Another Status
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {unselectedStatuses.map((status) => (
                        <Button
                          key={status}
                          variant="outlined"
                          sx={{
                            borderColor: statusColors[status],
                            color: statusColors[status],
                          }}
                          onClick={() => handleAddStatus(status)}
                        >
                          {status}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* Order Steps + Notes */}
                <OrderStepsTable
                  taskId={selectedTask.id.toString()}
                  stepsByTask={stepsByTask}
                  setStepsByTask={setStepsByTask}
                  notesByTask={notesByTask}
                  setNotesByTask={setNotesByTask}
                />

                {/* PASTE FUNCTIONALITY BOX */}
                <Box>
                  <Typography variant="h6">Paste Task Data</Typography>
                  <TextField
                    label="Paste Here"
                    fullWidth
                    multiline
                    rows={4}
                    margin="dense"
                    variant="outlined"
                    onPaste={handlePaste}
                  />

                  {/* Display Pasted Content (Text/HTML) */}
                  {pastedData[selectedTask.id] && (
                    <Box
                      mt={2}
                      p={2}
                      sx={{
                        backgroundColor: '#f9f9f9',
                        borderRadius: 1,
                        border: '1px solid #ddd',
                        maxHeight: '1000px',
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      <Typography
                        variant="body1"
                        dangerouslySetInnerHTML={{ __html: pastedData[selectedTask.id] }}
                      />
                    </Box>
                  )}

                  {/* Display Pasted Images */}
                  {pastedImages[selectedTask.id] && pastedImages[selectedTask.id].length > 0 && (
                    <Box mt={2} display="flex" flexDirection="column" gap={2}>
                      {pastedImages[selectedTask.id].map((image, index) => (
                        <Box
                          key={index}
                          sx={{
                            maxWidth: '100%',
                            maxHeight: '1000px',
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                          }}
                        >
                          <img
                            src={image}
                            alt="Pasted"
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>

        {/* Pagination Controls */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: '600px', mb: 2 }}
        >
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Items Per Page</InputLabel>
            <Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              label="Items Per Page"
            >
              {[5, 25, 100].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Pagination
            count={Math.ceil(filteredTasks.length / itemsPerPage)}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ tasks: { tasks } }: any) => ({
  tasks,
});

const mapDispatchToProps = (dispatch: any) => ({
  getTasks: (page: number, limit: number) => dispatch(getTasksThunk({ page, limit })),
  removeTask: (id: number) => dispatch(removeTaskThunk(id)),
  updateTask: (task: Task) => dispatch(updateTaskThunk(task)),
  addTask: (task: Task) => dispatch(createTaskThunk(task)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
