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
  StepRow,
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
import PastedHistoryList from '../tables/PastedHistoryList';
import TaskPresence from './TaskPresence';
import { ALL_STATUSES, defaultRows, initialValues, CURRENT_USER } from '../../constants';
import * as API from '../../api';
import { parseStoredImages, resolveMediaUrl } from '../../utils/media';

// Initialize steps for each task ID
const createInitialData = (count: number): StepsByTask => {
  const result: StepsByTask = {};
  for (let i = 1; i <= count; i++) {
    result[i] = defaultRows.map((row) => ({ ...row }));
  }
  return result;
};

// const createInitialData = (count: number): Record<number, StepRow[]> => {
//   const result: Record<number, StepRow[]> = {};
//   for (let i = 1; i <= count; i++) {
//     result[i] = defaultRows.map((row) => ({ ...row }));
//   }
//   return result;
// };

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
  const [stepsByTask, setStepsByTask] = useState<StepsByTask>(
    createInitialData(tasks.length)
  );

  const [notesByTask, setNotesByTask] = useState<{ [taskId: number]: OrderNotes }>({});
  const [pastedByTask, setPastedByTask] = useState<{ [taskId: number]: PastedEntry[] }>({});

  // ========== SERVER-SIDE PAGINATION + SEARCH ==========
  useEffect(() => {
    getTasks(currentPage, itemsPerPage, searchQuery);
  }, [currentPage, itemsPerPage, getTasks]);

  const isFirstSearchEffect = React.useRef(true);
  // Debounce search so typing “test” hits the API (incl. pasted/OCR text)
  useEffect(() => {
    if (isFirstSearchEffect.current) {
      isFirstSearchEffect.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
      getTasks(1, itemsPerPage, searchQuery);
    }, 350);
    return () => window.clearTimeout(handle);
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3) Whenever Redux tasks changes, copy them into clientTasks
  //    and hydrate pasted history from DB (so pastes survive refresh)
  useEffect(() => {
    setClientTasks(tasks);
    setPastedByTask((prev) => {
      const next = { ...prev };
      tasks.forEach((task) => {
        const serverPastes = (task as any).PastedHistories as
          | Array<{ id: number; text?: string; images?: unknown }>
          | undefined;
        if (!serverPastes?.length) return;

        const byId = new Map<number, PastedEntry>();
        (next[task.id] || []).forEach((entry) => {
          if (entry.id) byId.set(entry.id, entry);
        });

        const merged: PastedEntry[] = serverPastes.map((ph) => {
          const existing = byId.get(ph.id);
          const serverImages = parseStoredImages(ph.images).map(resolveMediaUrl);
          return {
            id: ph.id,
            text: ph.text || existing?.text || '',
            // Prefer already-loaded data URLs in session; else server URLs
            images:
              existing?.images?.length && existing.images[0]?.startsWith('data:')
                ? existing.images
                : serverImages.length
                  ? serverImages
                  : existing?.images || [],
          };
        });

        // Keep any local-only entries not yet confirmed by server
        const serverIds = new Set(serverPastes.map((p) => p.id));
        const localOnly = (next[task.id] || []).filter((e) => !e.id || !serverIds.has(e.id));
        next[task.id] = [...merged, ...localOnly.filter((e) => !e.id)];
      });
      return next;
    });
  }, [tasks]);

  // Initialize steps data for each new task
  // useEffect(() => {
  //   setStepsByTask((prev) => {
  //     const newStepsByTask = { ...prev };
  //     tasks.forEach((task) => {
  //       const taskIdStr = task.id.toString();
  //       if (!newStepsByTask[taskIdStr]) {
  //         newStepsByTask[taskIdStr] = defaultRows.map((row) => ({ ...row }));
  //       }
  //     });
  //     return newStepsByTask;
  //   });
  // }, [tasks]);
  useEffect(() => {
    setStepsByTask((prev) => {
      const next = { ...prev };
      tasks.forEach((task) => {
        if (!next[task.id]) {
          next[task.id] = defaultRows.map((r) => ({ ...r }));
        }
      });
      return next;
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
    console.log(clickedTask, 'clickedTask');
  };

  // 4) Filter tasks by search — title, notes, steps, pasted/OCR text (incl. unsaved pastes)
  const filteredTasks = clientTasks.filter((task) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const localPasted = pastedByTask[task.id] || [];
    const haystacks: string[] = [
      task.title,
      task.ship,
      task.priority,
      ...(task.status || []),
      task.Note?.critical || '',
      task.Note?.general || '',
      task.Note?.art || '',
      ...(task.Steps || []).flatMap((s) => [s.step, s.notes, s.by]),
      ...((task as any).PastedHistories || []).map((p: { text?: string }) => p.text || ''),
      ...localPasted.map((p) => p.text || ''),
      ...(notesByTask[task.id]
        ? [
            notesByTask[task.id].critical,
            notesByTask[task.id].general,
            notesByTask[task.id].art,
          ]
        : []),
    ];

    return haystacks.some((value) => String(value || '').toLowerCase().includes(q));
  });

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

  // Pasted data — save each paste to DB immediately
  const handleSavePastedData = async (taskId: number, text: string, images: string[]) => {
    // Optimistic UI
    setPastedByTask((prev) => {
      const oldEntries = prev[taskId] || [];
      return {
        ...prev,
        [taskId]: [...oldEntries, { text, images }],
      };
    });

    try {
      const { data } = await API.addPastedHistory(taskId, text, images);
      const serverImages = parseStoredImages(data.images).map(resolveMediaUrl);

      setPastedByTask((prev) => {
        const entries = [...(prev[taskId] || [])];
        // Attach server id to the matching optimistic entry (last without id + same text)
        for (let i = entries.length - 1; i >= 0; i--) {
          if (!entries[i].id && entries[i].text === text) {
            entries[i] = {
              ...entries[i],
              id: data.id,
              text: data.text || text,
              images: images.length ? images : serverImages,
            };
            break;
          }
        }
        return { ...prev, [taskId]: entries };
      });
    } catch (err) {
      console.error('Failed to save pasted data to DB', err);
      alert('Paste is visible locally but failed to save to the database. Check the server and try again.');
    }
  };

  // "Save Task" => notes/steps/status (pastes already auto-save to DB)
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
    const saver = CURRENT_USER.name;

    const notesWithSaver = { ...notes, lastSavedBy: saver };
    const stepsWithSaver = steps.map((step) => ({ ...step, lastSavedBy: saver }));

    setNotesByTask((prev) => ({ ...prev, [taskId]: notesWithSaver }));
    setStepsByTask((prev) => ({ ...prev, [taskId]: stepsWithSaver }));

    const payload: SavePayload = {
      id: selectedTask.id,
      title: selectedTask.title,
      ship: selectedTask.ship,
      art: selectedTask.art,
      dueDate: selectedTask.dueDate,
      inHand: selectedTask.inHand,
      status: selectedTask.status,
      notes: notesWithSaver,
      steps: stepsWithSaver,
      // Pastes are saved via POST /pasted-history — avoid re-uploading/duplicating
      pastedHistory: [],
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
          helperText="Searches titles, notes, steps, and text inside pasted orders/screenshots"
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
                              {/* <Typography variant="body2">{st}</Typography> */}
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
                <TaskPresence taskId={selectedTask.id} />
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
                  taskId={selectedTask.id}
                  filteredTasks={filteredTasks}
                  selectedTask={selectedTask}
                  stepsByTask={stepsByTask}
                  setStepsByTask={setStepsByTask}
                  notesByTask={notesByTask}
                  setNotesByTask={setNotesByTask}
                />
                <OrderNotesPastedData
                  selectedTask={selectedTask}
                  onSavePastedData={handleSavePastedData}
                />
                {selectedTask && (
                  <PastedHistoryList
                    taskId={selectedTask.id}
                    entries={pastedByTask[selectedTask.id] || []}
                    onChange={(entries) =>
                      setPastedByTask((prev) => ({
                        ...prev,
                        [selectedTask.id]: entries,
                      }))
                    }
                  />
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
  getTasks: (page: number, limit: number, search = '') =>
    dispatch(getTasksThunk({ page, limit, search })),
  removeTask: (id: number) => dispatch(removeTaskThunk(id)),
  updateTask: (task: SavePayload) => dispatch(updateTaskThunk(task)),
  addTask: (task: Task) => dispatch(createTaskThunk(task)),
  setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
  setItemsPerPage: (limit: number) => dispatch(setItemsPerPage(limit)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
