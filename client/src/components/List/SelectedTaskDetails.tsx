// src/components/List/SelectedTaskDetails.tsx

import React from 'react';
import { Box, Button, Typography, LinearProgress, TextField } from '@mui/material';
import { Task, TaskStatus } from '../../types';
import { statusColors } from '../../utils/colors';
import OrderStepsTable, { StepsByTask, OrderNotes } from '../tables/OrderNotesTable';

interface SelectedTaskDetailsProps {
  selectedTask: Task;
  ALL_STATUSES: TaskStatus[];
  selectedStatuses: TaskStatus[];
  unselectedStatuses: TaskStatus[];
  handleRemoveStatus: (status: TaskStatus) => void;
  handleAddStatus: (status: TaskStatus) => void;
  handleSaveTask: () => void;
  stepsByTask: StepsByTask;
  setStepsByTask: React.Dispatch<React.SetStateAction<StepsByTask>>;
  notesByTask: { [taskId: string]: OrderNotes };
  setNotesByTask: React.Dispatch<React.SetStateAction<{ [taskId: string]: OrderNotes }>>;
  pastedData: { [key: number]: string };
  pastedImages: { [key: number]: string[] };
  handlePaste: (e: React.ClipboardEvent) => void;
}

const SelectedTaskDetails: React.FC<SelectedTaskDetailsProps> = ({
  selectedTask,
  ALL_STATUSES,
  selectedStatuses,
  unselectedStatuses,
  handleRemoveStatus,
  handleAddStatus,
  handleSaveTask,
  stepsByTask,
  setStepsByTask,
  notesByTask,
  setNotesByTask,
  pastedData,
  pastedImages,
  handlePaste,
}) => {
  // Calculate progress
  const totalStatuses = ALL_STATUSES.length;
  const doneStatuses = selectedStatuses.length;
  const progressPercent = Math.round((doneStatuses / totalStatuses) * 100);

  return (
    <>
      <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
        <Button variant="contained" color="success" fullWidth onClick={handleSaveTask}>
          Save Task
        </Button>
      </Box>

      <Box
        minHeight="200px"
        p={2}
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

          {/* PROGRESS BAR */}
          <Typography variant="subtitle1" gutterBottom>
            Progress Bar
          </Typography>
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
            {pastedImages[selectedTask.id].map((image, idx) => (
              <Box
                key={idx}
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
  );
};

export default SelectedTaskDetails;
