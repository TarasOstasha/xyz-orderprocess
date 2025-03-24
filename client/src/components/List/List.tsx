import { parseISO, format, isValid } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import { connect } from 'react-redux';
import { ListProps, Task, TaskStatus, PastedEntry, SavePayload } from '../../types';
import {
  getTasksThunk,
  removeTaskThunk,
  updateTaskThunk,
  createTaskThunk,
  setCurrentPage,
  setItemsPerPage,
} from '../../store/slices/taskSlice';

import { StepsByTask, OrderNotes } from '../../types';
import { ALL_STATUSES, defaultRows } from '../../constants';
import SearchBar from '../SearchBar/SearchBar';
import AddTaskDialog from '../AddTaskDialog/AddTaskDialog';
import BulkActions from '../BulkActions/BulkActions';
import TaskTable from '../TaskTable/TaskTable';
import PaginationControls from '../PaginationControls/PaginationControls';

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
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);

  // Steps and Notes dictionaries
  const [stepsByTask, setStepsByTask] = useState<StepsByTask>(createInitialData(tasks.length));
  const [notesByTask, setNotesByTask] = useState<{ [taskId: string]: OrderNotes }>({});
  const [pastedByTask, setPastedByTask] = useState<{ [taskId: number]: PastedEntry[] }>({});

  // Open/close the Add Task dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [isEditing, setIsEditing] = useState(false);

  /* 
    ========== SERVER-SIDE PAGINATION ==========
    We rely on the back end to return tasks for (currentPage, itemsPerPage).
    Whenever these values change, fetch new data.
  */
  useEffect(() => {
    getTasks(currentPage, itemsPerPage);
    console.log(tasks, 'tasks');
  }, [currentPage, itemsPerPage]);

  // Initialize steps data for each new task
  useEffect(() => {
    console.log(tasks, 'tasks');
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

  useEffect(() => {
    console.log('Child sees updated selectedTask:', selectedTask);
  }, [selectedTask]);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  // Submit new task
  const handleSubmit = (values: Task, formikBag: any) => {
    console.log('first');
    console.log(values, 'values');
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

  // transform date
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
    console.log(task, 'tasks in row click')
    setSelectedTask((prev) => (prev?.id === task.id ? null : task));
  };

  // Filter tasks by search (local client filter)
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If tasks is empty, show a message
  if (!tasks.length) {
    return <Typography variant="h6">No tasks available</Typography>;
  }

  // =========== TWO-BOX STATUS LOGIC ===========
  const selectedStatuses = selectedTask?.status || [];
  const unselectedStatuses = ALL_STATUSES.filter((s) => !selectedStatuses.includes(s));

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

  const handleSavePastedData = (taskId: number, text: string, images: string[]) => {
    console.log('Parent got new pasted data:', { taskId, text, images });
    // Append a new entry to the array
    setPastedByTask((prev) => {
      const oldEntries = prev[taskId] || [];
      return {
        ...prev,
        [taskId]: [...oldEntries, { text, images }],
      };
    });
  };

  const handleSaveAllData = () => {
    if (!selectedTask) return;
    console.log(selectedTask, 'selectedTask');
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
    //console.log('Sending to backend =>', payload);
  };

  const handleFieldChange = (field: keyof Task, newValue: string) => {
    if (!selectedTask) return;
    setSelectedTask((prev) => prev && { ...prev, [field]: newValue });
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
      <SearchBar searchQuery={searchQuery} onChange={setSearchQuery} />

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
      <AddTaskDialog open={open} onClose={handleClose} onSubmit={handleSubmit} />

      {/* BULK ACTIONS */}
      <BulkActions
        selectedTasks={selectedTasks.length}
        onDelete={handleDeleteSelected}
        onSuccess={handleSuccessSelected}
      />

      {/* TASK TABLE */}
      <TaskTable
        tasks={filteredTasks}
        selectedTasks={selectedTasks}
        selectedTaskId={selectedTask?.id ?? null}
        onCheckboxChange={handleCheckboxChange}
        onRowClick={handleRowClick}
        // Right side details
        selectedTask={selectedTask}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSaveAllData={handleSaveAllData}
        handleFieldChange={handleFieldChange}
        handleSaveTop={handleSaveTop}
        handleCancelTop={handleCancelTop}
        // Status logic
        selectedStatuses={selectedStatuses}
        unselectedStatuses={unselectedStatuses}
        handleRemoveStatus={handleRemoveStatus}
        handleAddStatus={handleAddStatus}
        // Steps/Notes/Pasted
        stepsByTask={stepsByTask}
        setStepsByTask={setStepsByTask}
        notesByTask={notesByTask}
        setNotesByTask={setNotesByTask}
        pastedByTask={pastedByTask}
        handleSavePastedData={handleSavePastedData}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
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

