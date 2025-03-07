// src/components/List/TaskTable.tsx

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Box,
  Typography,
} from '@mui/material';
import { Task } from '../../types';
import { statusColors } from '../../utils/colors';

interface TaskTableProps {
  tasks: Task[];
  filteredTasks: Task[];
  selectedTasks: number[];
  selectedTask: Task | null;
  handleRowClick: (task: Task) => void;
  handleCheckboxChange: (taskId: number) => void;
  setSelectedTasks: React.Dispatch<React.SetStateAction<number[]>>;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  filteredTasks,
  selectedTasks,
  selectedTask,
  handleRowClick,
  handleCheckboxChange,
  setSelectedTasks,
}) => {
  return (
    <TableContainer component={Paper} sx={{ maxWidth: 900, flex: 1 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              {/* Bulk select/unselect all */}
              <Checkbox
                checked={selectedTasks.length === tasks.length && tasks.length > 0}
                onChange={() =>
                  setSelectedTasks(
                    selectedTasks.length === tasks.length ? [] : tasks.map((t) => t.id)
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
  );
};

export default TaskTable;
