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

  const [pastedData, setPastedData] = useState<{ [key: number]: string }>({});
  const [pastedImages, setPastedImages] = useState<{ [key: number]: string[] }>({});  

  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [itemsPerPage, setItemsPerPage] = useState(5); // Default items per page is 5

  // 1. Find indexes
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const initialValues: Task = {
    id: parseInt(
      uuidv4()
        .replace(/[^0-9]/g, '')
        .slice(0, 10),
      10
    ), // only for testing purposes
    title: '',
    dueDate: '',
    status: [],
    priority: '' as 'High' | 'Medium' | 'Low',
  };

  // Handle open/close
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (values: Task, formikBag: any) => {
    console.log('Submitting form...', values);
    try {
      addTask(values);
      //console.log('Task added:', values);
    } catch (error) {
      console.error('Error adding task:', error);
    }
    formikBag.resetForm();
    handleClose();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const clipboardData = e.clipboardData;
  
    if (!selectedTask) return; // Ensure a task is selected
  
    // Check for image data
    const items = clipboardData.items;
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
  
    // Check for HTML content (tables, formatted text)
    const htmlData = clipboardData.getData('text/html');
    if (htmlData) {
      setPastedData((prev) => ({
        ...prev,
        [selectedTask.id]: htmlData,
      }));
      return;
    }
  
    // Default to plain text
    const textData = clipboardData.getData('text');
    setPastedData((prev) => ({
      ...prev,
      [selectedTask.id]: textData,
    }));
  };
  

  // Fetch tasks from API when component mounts
  useEffect(() => {
    getTasks(currentPage, itemsPerPage);
  }, [getTasks, currentPage, itemsPerPage]);

  // Handle checkbox change
  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Remove selected tasks
  const handleDeleteSelected = () => {
    selectedTasks.forEach((taskId) => {
      console.log(taskId);
      removeTask(taskId);
    });
    setSelectedTasks([]);
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask((prev) => (prev?.id === task.id ? null : task));
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusToggle = (status: TaskStatus) => {
    if (!selectedTask) return;
    const updatedStatus = selectedTask.status.includes(status)
      ? selectedTask.status.filter((s) => s !== status) // Remove status
      : [...selectedTask.status, status]; // Add status
    const updatedTask = { ...selectedTask, status: updatedStatus };
    setSelectedTask(updatedTask);
    updateTask(updatedTask);
  };

  // 2. Slice the tasks to only show the subset
  const paginatedTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);
  if (!tasks.length) {
    return <Typography variant="h6">No tasks available</Typography>;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      gap={2}
      sx={{ backgroundColor: '#fff' }}
    >
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

      {/* Popup Window */}
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

      {tasks.length > 0 && selectedTasks.length > 0 && (
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        >
          Delete Selected ({selectedTasks.length})
        </Button>
      )}

      <Box display="flex" flexDirection="column" justifyContent="center" gap={3}>
        {/* TASK TABLE */}
        <Box display="flex" justifyContent="center" gap={3} sx={{ mt: 2 }}>
          <Box>
            <TableContainer component={Paper} sx={{ maxWidth: 600, flex: 1 }}>
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
                    <TableCell>Title</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
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
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleCheckboxChange(task.id)}
                        />
                      </TableCell>
                      <TableCell>{task.title}</TableCell>
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

          <Box>
            {selectedTask && (
              <>
                <Box
                  width="600px"
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
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Status:
                  </Typography>
                  <Box display="flex" gap={1} mt={1}>
                    {['Pending', 'In Progress', 'Completed', 'On Hold', 'Review'].map((status) => (
                      <Button
                        key={status}
                        variant={
                          selectedTask.status.includes(status as TaskStatus)
                            ? 'contained'
                            : 'outlined'
                        }
                        sx={{ backgroundColor: statusColors[status as TaskStatus], color: '#fff' }}
                        onClick={() => handleStatusToggle(status as TaskStatus)}
                      >
                        {status}
                      </Button>
                    ))}
                  </Box>
                </Box>

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
      <Box mt={2} p={2} sx={{ backgroundColor: '#f9f9f9', borderRadius: 1, border: '1px solid #ddd', maxHeight: '1000px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
        <Typography variant="body1" dangerouslySetInnerHTML={{ __html: pastedData[selectedTask.id] }} />
      </Box>
    )}

    {/* Display Pasted Images */}
    {pastedImages[selectedTask.id] && pastedImages[selectedTask.id].length > 0 && (
      <Box mt={2} display="flex" flexDirection="column" gap={2}>
        {pastedImages[selectedTask.id].map((image, index) => (
          <Box key={index} sx={{ maxWidth: '100%', maxHeight: '1000px', overflowY: 'auto', border: '1px solid #ddd' }}>
            <img src={image} alt="Pasted" style={{ width: '100%', height: 'auto', display: 'block' }} />
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

        {/* Hide task details if no task is selected */}
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
