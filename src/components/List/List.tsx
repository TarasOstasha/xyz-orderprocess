import React, { useState } from "react";
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
  Checkbox 
} from '@mui/material';
import { Task } from '../../types';
import { statusColors } from '../../utils/colors';



const initialTasks: Task[] = [
    { id: 1, title: "Finish report", dueDate: "2024-02-21", status: ["Pending", "Review"], priority: "High" },
    { id: 2, title: "Call client", dueDate: "2024-02-22", status: ["In Progress"], priority: "Medium" },
    { id: 3, title: "Prepare slides", dueDate: "2024-02-23", status: ["Completed", "On Hold"], priority: "Low" },
  ];

const List: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  
    // Handle checkbox change
    const handleCheckboxChange = (taskId: number) => {
      setSelectedTasks((prev) =>
        prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
      );
    };
  
    // Remove selected tasks
    const handleDeleteSelected = () => {
      setTasks((prevTasks) => prevTasks.filter((task) => !selectedTasks.includes(task.id)));
      setSelectedTasks([]); // Clear selection after deleting
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
                              borderRadius: "3px",
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

export default List;
