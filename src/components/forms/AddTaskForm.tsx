import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  DialogActions,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
} from '@mui/material';
import { Task, TaskStatus } from '../../types';
import TASK_VALIDATION_SCHEMA from '../../utils/validationSchemas';

interface AddTaskFormProps {
  initialValues: Task;
  onSubmit: (values: Task, formikBag: any) => void;
  onClose: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ initialValues, onSubmit, onClose }) => {
  return (
    <Formik initialValues={initialValues} validationSchema={TASK_VALIDATION_SCHEMA} onSubmit={onSubmit}>
      {({ errors, touched, values }) => (
        <Form>
          {/* Title Field */}
          <Field
            as={TextField}
            label="Title"
            name="title"
            fullWidth
            margin="dense"
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title ? errors.title : ''}
          />

          {/* Due Date Field */}
          <Field
            as={TextField}
            label="Due Date"
            name="dueDate"
            type="date"
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
            error={touched.dueDate && Boolean(errors.dueDate)}
            helperText={touched.dueDate ? errors.dueDate : ''}
          />

          {/* Priority Select */}
          <Field
            as={TextField}
            label="Priority"
            name="priority"
            select
            fullWidth
            margin="dense"
            error={touched.priority && Boolean(errors.priority)}
            helperText={touched.priority ? errors.priority : ''}
          >
            {["High", "Medium", "Low"].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Field>

          {/* Status Multi-Select - Wrap with FormControl */}
          <FormControl fullWidth margin="dense" error={touched.status && Boolean(errors.status)}>
            <InputLabel>Status</InputLabel>
            <Field
              as={Select}
              multiple
              name="status"
              renderValue={(selected: TaskStatus[]) => selected.join(', ')}
            >
              {["Pending", "In Progress", "Completed", "On Hold", "Review"].map((option) => (
                <MenuItem key={option} value={option as TaskStatus}>
                  <Checkbox checked={values.status.includes(option as TaskStatus)} />
                  {option}
                </MenuItem>
              ))}
            </Field>
            {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
          </FormControl>

          {/* Buttons */}
          <DialogActions>
            <Button onClick={onClose} color="error">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Add Task
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};

export default AddTaskForm;
