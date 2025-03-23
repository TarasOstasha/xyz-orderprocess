// AddTaskDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import AddTaskForm from '../forms/AddTaskForm';
import { Task } from '../../types';
import { ALL_STATUSES, defaultRows, initialValues } from '../../constants';

interface AddTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Task, formikBag: any) => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ open, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <AddTaskForm
          // pass your initial values
          initialValues={initialValues}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
