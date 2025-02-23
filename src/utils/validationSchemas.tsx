import * as Yup from 'yup';

// Validation Schema for Task
const TASK_VALIDATION_SCHEMA = Yup.object().shape({
  id: Yup.number()
    .required('ID is required')
    .positive('ID must be a positive number')
    .integer('ID must be an integer'),
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  dueDate: Yup.date().min(new Date())
    .required('Due Date is required'),
  status: Yup.array()
    .of(Yup.string().required('Status is required'))
    .min(1, 'At least one status is required'),
  priority: Yup.string()
    .required('Priority is required')
    .oneOf(['Low', 'Medium', 'High'], 'Priority must be Low, Medium, or High'),
});

export default TASK_VALIDATION_SCHEMA;
