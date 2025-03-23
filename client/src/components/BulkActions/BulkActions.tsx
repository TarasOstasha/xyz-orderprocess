// BulkActions.tsx
import React from 'react';
import { Button, Box } from '@mui/material';

interface BulkActionsProps {
    selectedTasks: number;
  onDelete: () => void;
  onSuccess: () => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({ selectedTasks, onDelete, onSuccess }) => {
  if (selectedTasks === 0) return null;

  return (
    <Box display="flex" justifyContent="center" gap={3}>
      <Button variant="contained" color="error" onClick={onDelete}>
        Delete Selected ({selectedTasks})
      </Button>
      <Button variant="contained" color="success" onClick={onSuccess}>
        Success Selected ({selectedTasks})
      </Button>
    </Box>
  );
};

export default BulkActions;
