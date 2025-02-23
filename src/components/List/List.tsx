import { v4 as uuidv4 } from 'uuid';
import { Formik, Form, Field } from 'formik';
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
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select 
} from '@mui/material';
import { connect } from 'react-redux';
import { Task, TaskStatus } from '../../types';
import { statusColors } from '../../utils/colors';
import { getTasksThunk, removeTaskThunk, updateTaskThunk, createTaskThunk } from '../../store/slices/taskSlice';
import styles from './List.module.scss';
import TASK_VALIDATION_SCHEMA from '../../utils/validationSchemas';
import AddTaskForm from '../forms/AddTaskForm';



const List: React.FC<{
  tasks: Task[];
  getTasks: () => void;
  removeTask: (taskId: number) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Task) => void;
}> = ({ tasks, getTasks, removeTask, updateTask, addTask }) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);


  const initialValues: Task = {
    id: parseInt(uuidv4().replace(/[^0-9]/g, '').slice(0, 10), 10), // only for testing purposes
    title: '',
    dueDate: '',
    status: [],
    priority: '' as "High" | "Medium" | "Low",
  }

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

  // Fetch tasks from API when component mounts
  useEffect(() => {
    getTasks();
  }, [getTasks]);

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

    // Update local state
    setSelectedTask(updatedTask);

    // Dispatch Redux action to update task in the store and database
    updateTask(updatedTask);
  };
  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4} gap={2}>
      <TextField
        label="Search Tasks"
        variant="standard"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ width: '500px' }}
        className={styles.searchTask}
      />
      {/* Only show delete button if tasks exist */}
      <>
        {/* Add Task Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleOpen}
          sx={{ alignSelf: 'flex-start', mb: 2 }}
        >
          Add New Task
        </Button>

        {/* Popup Window */}
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Add New Task</DialogTitle>
          <DialogContent>
            <AddTaskForm initialValues={initialValues} onSubmit={handleSubmit} onClose={handleClose} />
            
          </DialogContent>
        </Dialog>
      </>
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

      {/* Hide table & details if no tasks */}
      {tasks.length > 0 && (
        <Box display="flex" justifyContent="center" gap={3} alignItems="flex-start">
          {/* TASK TABLE */}
          <TableContainer component={Paper} sx={{ maxWidth: 600, flex: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.length === tasks.length && tasks.length > 0}
                      onChange={() =>
                        setSelectedTasks(
                          selectedTasks.length === tasks.length ? [] : tasks.map((task) => task.id)
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
                {filteredTasks.map((task) => (
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

          {/* HIDE TASK DETAILS IF NO TASK IS SELECTED */}
          {selectedTask && (
            <Box
              width="300px"
              minHeight="200px"
              p={2}
              component={Paper}
              sx={{
                flexShrink: 0,
                boxShadow: 3,
                borderRadius: 2,
                border: '1px solid #ddd',
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
                      selectedTask.status.includes(status as TaskStatus) ? 'contained' : 'outlined'
                    }
                    sx={{ backgroundColor: statusColors[status as TaskStatus], color: '#fff' }}
                    onClick={() => handleStatusToggle(status as TaskStatus)}
                  >
                    {status}
                  </Button>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

const mapStateToProps = ({ tasks: { tasks } }: any) => ({
  tasks,
});

const mapDispatchToProps = (dispatch: any) => ({
  getTasks: () => dispatch(getTasksThunk()),
  removeTask: (id: number) => dispatch(removeTaskThunk(id)),
  updateTask: (task: Task) => dispatch(updateTaskThunk(task)),
  addTask: (task: Task) => dispatch(createTaskThunk(task)),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
