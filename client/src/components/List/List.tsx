import { parseISO, format, isValid } from 'date-fns';
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
  LinearProgress,
} from '@mui/material';
import { connect } from 'react-redux';
import {
  ListProps,
  Task,
  TaskStatus,
  PastedEntry,
  SavePayload,
} from '../../types';
import { statusColors } from '../../utils/colors';
import {
  getTasksThunk,
  removeTaskThunk,
  updateTaskThunk,
  createTaskThunk,
  setCurrentPage,
  setItemsPerPage,
} from '../../store/slices/taskSlice';
import styles from './List.module.scss';
import AddTaskForm from '../forms/AddTaskForm';
import { StepsByTask, OrderNotes } from '../../types';
import OrderStepsTable from '../tables/OrderNotesTable';
import OrderNotesPastedData from '../tables/OrderNotesPastedData';
import { ALL_STATUSES, defaultRows, initialValues } from '../../constants';

// Initialize steps for each task ID
const createInitialData = (count: number): StepsByTask => {
  const result: StepsByTask = {};
  for (let i = 1; i <= count; i++) {
    result[i.toString()] = defaultRows.map((row) => ({ ...row }));
  }
  return result;
};

const List: React.FC<ListProps> = ({
  tasks,
  totalPages,
  currentPage,
  itemsPerPage,
  getTasks,
  removeTask,
  updateTask,
  addTask,
  setCurrentPage,
  setItemsPerPage,
}) => {
  // 1) Local copy of tasks so we can do immediate UI changes
  const [clientTasks, setClientTasks] = useState<Task[]>([]);
  
  // 2) The selected task from local array
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Steps/Notes/Pasted local dictionaries
  // const [stepsByTask, setStepsByTask] = useState<StepsByTask>(
  //   createInitialData(tasks?.length || 0)
  // );
const [stepsByTask, setStepsByTask] = useState<StepsByTask>(() =>
  createInitialData(Array.isArray(tasks) ? tasks.length : 0)
);


  const [notesByTask, setNotesByTask] = useState<{ [taskId: string]: OrderNotes }>({});
  const [pastedByTask, setPastedByTask] = useState<{ [taskId: number]: PastedEntry[] }>({});

  // ========== SERVER-SIDE PAGINATION ==========
  useEffect(() => {
    getTasks(currentPage, itemsPerPage);
  }, [currentPage, itemsPerPage, getTasks]);

  // 3) Whenever Redux tasks changes, copy them into clientTasks
  useEffect(() => {
    setClientTasks(tasks);
  }, [tasks]);

  // Initialize steps data for each new task
  useEffect(() => {
    setStepsByTask((prev) => {
      const newStepsByTask = { ...prev };
      tasks.forEach((task) => {
        const taskIdStr = task.id.toString();
        if (!newStepsByTask[taskIdStr]) {
          newStepsByTask[taskIdStr] = defaultRows.map((row) => ({ ...row }));
        }
      });
      return newStepsByTask;
    });
  }, [tasks]);

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

  // Check/uncheck tasks
  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  // Bulk delete
  const handleDeleteSelected = () => {
    selectedTasks.forEach((taskId) => {
      removeTask(taskId);
    });
    setSelectedTasks([]);
  };

  // Format date
  const formatDateString = (dateString?: string): string => {
    if (!dateString) return '';
    const date = parseISO(dateString);
    if (!isValid(date)) {
      return dateString;
    }
    return format(date, 'MM/dd/yyyy');
  };

  // Bulk mark “Completed”
  const handleSuccessSelected = () => {
    setClientTasks((prev) =>
      prev.map((t) => {
        if (selectedTasks.includes(t.id)) {
          // Add "Completed" if not present
          if (!t.status.includes('Completed')) {
            return { ...t, status: [...t.status, 'Completed'] };
          }
        }
        return t;
      })
    );
    // Optionally do an immediate server update, or wait for user to "Save Task"
  };

  // Row click selects a single task from local array
  const handleRowClick = (clickedTask: Task) => {
    setSelectedTask((prev) => (prev?.id === clickedTask.id ? null : clickedTask));
  };

  // 4) Filter tasks by search in local array
  const filteredTasks = clientTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If tasks is empty, show a message
  if (!tasks.length) {
    return <Typography variant="h6">No tasks available</Typography>;
  }

  // =========== TWO-BOX STATUS LOGIC ===========
  const selectedStatuses = selectedTask?.status || [];
  const unselectedStatuses = ALL_STATUSES.filter(
    (s) => !selectedStatuses.includes(s)
  );

  // 5) Add/Remove status only in local data => immediate line-through
  const handleAddStatus = (status: TaskStatus) => {
    if (!selectedTask) return;
    // Update the selectedTask in local state
    const newStatuses = [...selectedTask.status, status];
    const updatedSelected = { ...selectedTask, status: newStatuses };
    setSelectedTask(updatedSelected);

    // Also update the local tasks array so the table sees the new status
    setClientTasks((prev) =>
      prev.map((t) => {
        if (t.id === selectedTask.id) {
          return { ...t, status: newStatuses };
        }
        return t;
      })
    );
  };

  const handleRemoveStatus = (status: TaskStatus) => {
    if (!selectedTask) return;
    const newStatuses = selectedTask.status.filter((s) => s !== status);
    const updatedSelected = { ...selectedTask, status: newStatuses };
    setSelectedTask(updatedSelected);

    setClientTasks((prev) =>
      prev.map((t) => {
        if (t.id === selectedTask.id) {
          return { ...t, status: newStatuses };
        }
        return t;
      })
    );
  };

  // Pasted data
  const handleSavePastedData = (taskId: number, text: string, images: string[]) => {
    // Append a new entry to the array
    setPastedByTask((prev) => {
      const oldEntries = prev[taskId] || [];
      return {
        ...prev,
        [taskId]: [...oldEntries, { text, images }],
      };
    });
  };

  // "Save Task" => merges local changes into a final payload, then calls updateTask
  const handleSaveAllData = () => {
    if (!selectedTask) return;
    const taskId = selectedTask.id;
    const notes = notesByTask[taskId] || {
      critical: '',
      general: '',
      art: '',
      pasted: '',
      images: [],
    };
    const steps = stepsByTask[taskId] || [];
    const pastedHistory = pastedByTask[taskId] || [];

    // The final object to send to server
    const payload: SavePayload = {
      id: selectedTask.id,
      title: selectedTask.title,
      ship: selectedTask.ship,
      art: selectedTask.art,
      dueDate: selectedTask.dueDate,
      inHand: selectedTask.inHand,
      status: selectedTask.status,
      notes,
      steps,
      pastedHistory,
      priority: selectedTask.priority,
    };

    updateTask(payload);
  };

  const handleFieldChange = (field: keyof Task, newValue: string) => {
    if (!selectedTask) return;
    // Update the selectedTask
    setSelectedTask((prev) => prev && { ...prev, [field]: newValue });

    // Also update local tasks array
    if (selectedTask) {
      setClientTasks((prev) =>
        prev.map((t) =>
          t.id === selectedTask.id ? { ...t, [field]: newValue } : t
        )
      );
    }
  };

  const handleSaveTop = () => {
    handleSaveAllData();
    setIsEditing(false);
  };

  const handleCancelTop = () => {
    setIsEditing(false);
  };

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
      {clientTasks.length > 0 && selectedTasks.length > 0 && (
        <Box display="flex" justifyContent="center" gap={3}>
          <Button variant="contained" color="error" onClick={handleDeleteSelected}>
            Delete Selected ({selectedTasks.length})
          </Button>

          <Button variant="contained" color="success" onClick={handleSuccessSelected}>
            Success Selected ({selectedTasks.length})
          </Button>
        </Box>
      )}

      {/* TASK TABLE */}
      <Box display="flex" flexDirection="column" justifyContent="center" gap={3}>
        <Box display="flex" justifyContent="center" gap={3} sx={{ mt: 2 }}>
          <Box>
            <TableContainer component={Paper} sx={{ maxWidth: 900, flex: 1 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.length === clientTasks.length && clientTasks.length > 0}
                        onChange={() =>
                          setSelectedTasks(
                            selectedTasks.length === clientTasks.length
                              ? []
                              : clientTasks.map((t) => t.id)
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Ship</TableCell>
                    <TableCell>Art</TableCell>
                    <TableCell>In Hand</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTasks.map((task, index) => (
                    <TableRow
                      key={task.id ?? index}
                      onClick={() => handleRowClick(task)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedTask?.id === task.id ? '#f0f0f0' : 'transparent',
                        textDecoration: task.status.includes('Completed')
                          ? 'line-through'
                          : 'none',
                      }}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleCheckboxChange(task.id);
                          }}
                        />
                      </TableCell>
                      <TableCell>{task.title}</TableCell>
                      <TableCell>{formatDateString(task.ship)}</TableCell>
                      <TableCell>{formatDateString(task.art)}</TableCell>
                      <TableCell>{formatDateString(task.inHand)}</TableCell>
                      <TableCell>{formatDateString(task.dueDate)}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          {task.status.map((st) => (
                            <Box key={st} display="flex" alignItems="center" gap={1}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '3px',
                                  backgroundColor: statusColors[st],
                                }}
                              />
                              <Typography variant="body2">{st}</Typography>
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

          {/* RIGHT SIDE: SELECTED TASK DETAILS */}
          <Box>
            {selectedTask && (
              <>
                <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
                  <Button variant="contained" color="success" fullWidth onClick={handleSaveAllData}>
                    Save Task
                  </Button>
                </Box>
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
                  {!isEditing && (
                    <>
                      <Typography variant="h6">{selectedTask.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Art: {formatDateString(selectedTask.art)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        In Hand: {formatDateString(selectedTask.inHand)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Due Date: {formatDateString(selectedTask.dueDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Priority: {selectedTask.priority}
                      </Typography>
                    </>
                  )}
                  {!isEditing ? (
                    <Button variant="contained" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  ) : (
                    <Box display="flex" gap={2}>
                      <Button variant="contained" color="primary" onClick={handleSaveTop}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={handleCancelTop}>
                        Cancel
                      </Button>
                    </Box>
                  )}
                  {isEditing && (
                    <>
                      <TextField
                        label="Title"
                        variant="standard"
                        value={selectedTask.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        fullWidth
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        label="Art"
                        variant="standard"
                        value={formatDateString(selectedTask.art)}
                        onChange={(e) => handleFieldChange('art', e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        label="In Hand"
                        variant="standard"
                        value={formatDateString(selectedTask.inHand)}
                        onChange={(e) => handleFieldChange('inHand', e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <TextField
                        label="Due Date"
                        variant="standard"
                        value={formatDateString(selectedTask.dueDate)}
                        onChange={(e) => handleFieldChange('dueDate', e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <FormControl variant="standard" sx={{ mb: 2, minWidth: 120 }}>
                        <InputLabel>Priority</InputLabel>
                        <Select
                          label="Priority"
                          value={selectedTask.priority || ''}
                          onChange={(e) =>
                            handleFieldChange(
                              'priority',
                              e.target.value as 'High' | 'Medium' | 'Low'
                            )
                          }
                        >
                          <MenuItem value="High">High</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="Low">Low</MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  )}

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

                    {/* PROGRESS BAR */}
                    <Typography variant="subtitle1" gutterBottom>
                      Progress Bar
                    </Typography>
                    {(() => {
                      const totalStatuses = ALL_STATUSES.length;
                      const doneStatuses = selectedStatuses.length;
                      const progressPercent = Math.round(
                        (doneStatuses / totalStatuses) * 100
                      );

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
                <OrderNotesPastedData
                  selectedTask={selectedTask}
                  onSavePastedData={handleSavePastedData}
                />
                {selectedTask && pastedByTask[selectedTask.id] && (
                  <Box mt={2}>
                    {pastedByTask[selectedTask.id].map((entry, idx) => (
                      <Box key={idx} sx={{ mb: 2, p: 2, border: '1px solid #ddd' }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#333' }}>
                          {entry.text}
                        </Typography>

                        {entry.images.length > 0 && (
                          <Box mt={1} display="flex" flexDirection="column" gap={1}>
                            {entry.images.map((img, i2) => (
                              <img
                                key={i2}
                                src={img}
                                alt="Pasted"
                                style={{ width: '100%', border: '1px solid #ccc' }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
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
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => {
              setCurrentPage(value);
            }}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

const mapStateToProps = ({ tasks: { tasks, totalPages, currentPage, limit } }: any) => ({
  tasks,
  totalPages,
  currentPage,
  itemsPerPage: limit,
});

// Map Redux dispatch to props
const mapDispatchToProps = (dispatch: any) => ({
  getTasks: (page: number, limit: number) => dispatch(getTasksThunk({ page, limit })),
  removeTask: (id: number) => dispatch(removeTaskThunk(id)),
  updateTask: (task: SavePayload) => dispatch(updateTaskThunk(task)),
  addTask: (task: Task) => dispatch(createTaskThunk(task)),
  setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
  setItemsPerPage: (limit: number) => dispatch(setItemsPerPage(limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
