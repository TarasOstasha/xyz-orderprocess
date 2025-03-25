// TaskTable.tsx
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
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  LinearProgress,
} from '@mui/material';

import { Task, TaskStatus, StepsByTask, OrderNotes, PastedEntry } from '../../types';
import { statusColors } from '../../utils/colors';
import OrderStepsTable from '../tables/OrderNotesTable';
import OrderNotesPastedData from '../tables/OrderNotesPastedData';
import { ALL_STATUSES } from '../../constants';

// Example date formatting
function formatDateString(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // fallback if invalid
  }
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface TaskTableProps {
  // ====== Table Props ======
  tasks: Task[];
  selectedTasks: number[];                   // for checkboxes
  selectedTaskId: number | null;            // highlights the row
  onCheckboxChange: (taskId: number) => void;
  onRowClick: (task: Task) => void;

  // ====== Right-Side Details Props ======
  selectedTask: Task | null;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;

  handleSaveAllData: () => void;
  handleFieldChange: (field: keyof Task, newValue: string) => void;
  handleSaveTop: () => void;
  handleCancelTop: () => void;

  selectedStatuses: TaskStatus[];
  unselectedStatuses: TaskStatus[];
  handleRemoveStatus: (status: TaskStatus) => void;
  handleAddStatus: (status: TaskStatus) => void;

  // ====== Steps / Notes / Pasted Data ======
  stepsByTask: StepsByTask;
  setStepsByTask: React.Dispatch<React.SetStateAction<StepsByTask>>;
  notesByTask: { [taskId: string]: OrderNotes };
  setNotesByTask: React.Dispatch<React.SetStateAction<{ [taskId: string]: OrderNotes }>>;
  pastedByTask: { [taskId: number]: PastedEntry[] };
  handleSavePastedData: (taskId: number, text: string, images: string[]) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  // Table
  tasks,
  selectedTasks,
  selectedTaskId,
  onCheckboxChange,
  onRowClick,

  // Right side details
  selectedTask,
  isEditing,
  setIsEditing,
  handleSaveAllData,
  handleFieldChange,
  handleSaveTop,
  handleCancelTop,

  // Status logic
  selectedStatuses,
  unselectedStatuses,
  handleRemoveStatus,
  handleAddStatus,

  // Steps / Notes / Pasted
  stepsByTask,
  setStepsByTask,
  notesByTask,
  setNotesByTask,
  pastedByTask,
  handleSavePastedData,
}) => {
  return (
    <Box display="flex" flexDirection="column" gap={3}>
      {/* ===== TABLE SECTION ===== */}
      <Box display="flex" justifyContent="center" gap={3} sx={{ mt: 2 }}>
        <TableContainer component={Paper} sx={{ maxWidth: 900, flex: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.length === tasks.length && tasks.length > 0}
                    onChange={() => {
                      // "Select All" logic if desired
                    }}
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
              {tasks.map((task, index) => (
                <TableRow
                  key={task.id ?? index}
                  onClick={() => onRowClick(task)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedTaskId === task.id ? '#f0f0f0' : 'transparent',
                    textDecoration: task.status.includes('Completed') ? 'line-through' : 'none',
                  }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onChange={(e) => {
                        e.stopPropagation(); // don’t trigger row click
                        onCheckboxChange(task.id);
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

      {/* ===== RIGHT-SIDE DETAILS SECTION ===== */}
      {selectedTask && (
        <>
          {/* A "Save Task" button */}
          <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
            <Button variant="contained" color="success" fullWidth onClick={handleSaveAllData}>
              Save Task
            </Button>
          </Box>

          {/* The main detail panel */}
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
            {/* READ-ONLY FIELDS */}
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
                  Priority: {formatDateString(selectedTask.priority)}
                </Typography>
              </>
            )}

            {/* EDIT BUTTONS */}
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

            {/* EDIT FIELDS */}
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
                      handleFieldChange('priority', e.target.value as 'High' | 'Medium' | 'Low')
                    }
                  >
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}

            {/* STATUS BOXES */}
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
                const totalStatuses = ALL_STATUSES.length; // Usually from constants
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
          {/* ORDER STEPS + NOTES */}
          <OrderStepsTable
            taskId={selectedTask.id.toString()}
            stepsByTask={stepsByTask}
            setStepsByTask={setStepsByTask}
            notesByTask={notesByTask}
            setNotesByTask={setNotesByTask}
            selectedTask={selectedTask}
          />
          <OrderNotesPastedData
            selectedTask={selectedTask}
            onSavePastedData={handleSavePastedData}
          />

          {/* PASTED HISTORY */}
          {pastedByTask[selectedTask.id] && (
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
  );
};

export default TaskTable;
