import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
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
    <Formik
      initialValues={initialValues}
      validationSchema={TASK_VALIDATION_SCHEMA}
      onSubmit={onSubmit}
    >
      {({ errors, touched, values }) => (
        <Form>
          {/* Title/Subject Field */}
          <Field
            as={TextField}
            label="Title"
            name="title"
            fullWidth
            margin="dense"
            error={touched.title && Boolean(errors.title)}
            helperText={touched.title ? errors.title : ''}
          />
          {/* Ship */}
          <Field
            as={TextField}
            label="Ship"
            name="ship"
            fullWidth
            margin="dense"
            error={touched.ship && Boolean(errors.ship)}
            helperText={touched.ship ? errors.ship : ''}
          />
          {/* Art */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Field name="art">
              {({ field, form }: any) => (
                <DatePicker
                  label="Art"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    form.setFieldValue(field.name, date ? dayjs(date).format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'dense',
                      error: Boolean(form.errors.art && form.touched.art),
                      helperText: form.touched.art ? form.errors.art : '',
                    },
                  }}
                />
              )}
            </Field>
          </LocalizationProvider>
          {/* In Hand */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Field name="inHand">
              {({ field, form }: any) => (
                <DatePicker
                  label="In Hand"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    form.setFieldValue(field.name, date ? dayjs(date).format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'dense',
                      error: Boolean(form.errors.inHand && form.touched.inHand),
                      helperText: form.touched.inHand ? form.errors.inHand : '',
                    },
                  }}
                />
              )}
            </Field>
            {/* Status Multi-Select - Wrap with FormControl | Categories */}
            <FormControl fullWidth margin="dense" error={touched.status && Boolean(errors.status)}>
              <InputLabel>Status</InputLabel>
              <Field
                as={Select}
                multiple
                name="status"
                renderValue={(selected: TaskStatus[]) => selected.join(', ')}
              >
                {['Paid','In Progress','Completed','On Hold','Canceled','Approved','Order from Vendor Confirmed','Order Checked','Order Placed'].map((option) => (
                  <MenuItem key={option} value={option as TaskStatus}>
                    <Checkbox checked={values.status.includes(option as TaskStatus)} />
                    {option}
                  </MenuItem>
                ))}
              </Field>
              {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>
          </LocalizationProvider>
          {/* Due Date Field */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Field name="dueDate">
              {({ field, form }: any) => (
                <DatePicker
                  label="Due Date"
                  value={field.value ? dayjs(field.value) : null}
                  onChange={(date) =>
                    form.setFieldValue(field.name, date ? dayjs(date).format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: 'dense',
                      error: Boolean(form.errors.dueDate && form.touched.dueDate),
                      helperText: form.touched.dueDate ? form.errors.dueDate : '',
                    },
                  }}
                />
              )}
            </Field>
          </LocalizationProvider>

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
            {['High', 'Medium', 'Low'].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Field>

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
