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
} from '@mui/material';
import { connect } from 'react-redux';
import { Task } from '../../types';
import { statusColors } from '../../utils/colors';
import { getTasksThunk } from '../../store/slices/TaskSlice';


const List: React.FC<{ tasks: Task[]; getTasks: () => void }> = ({ tasks, getTasks }) => {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  // ✅ Fetch tasks from API when component mounts
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
    setSelectedTasks([]);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {/* Delete Button */}
      {selectedTasks.length > 0 && (
        <Button variant="contained" color="error" onClick={handleDeleteSelected} sx={{ mb: 2 }}>
          Delete Selected ({selectedTasks.length})
        </Button>
      )}

      {/* Task Table */}
      <TableContainer component={Paper} sx={{ maxWidth: 600 }}>
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
            {tasks.map((task) => (
              <TableRow key={task.id}>
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
  );
};


const mapStateToProps = ({ tasks: { tasks } }: any) => ({
  tasks
});


const mapDispatchToProps = (dispatch: any) => ({
  getTasks: () => dispatch(getTasksThunk()),
});

export default connect(mapStateToProps, mapDispatchToProps)(List);
