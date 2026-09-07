import * as Yup from 'yup';

// Validation Schema for Task
export const TASK_VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  ship: Yup.string()
    .required('Ship field is required')
    .min(2, 'Ship must be at least 2 characters')
    .max(50, 'Ship must not exceed 50 characters'),
  art: Yup.date()
    .required('Art date is required')
    .min(new Date(), 'Art date cannot be in the past'),
  inHand: Yup.date()
    .required('In Hand date is required')
    .min(new Date(), 'In Hand date cannot be in the past'),
  dueDate: Yup.date()
    .required('Due Date is required')
    .min(new Date(), 'Due Date cannot be in the past'),
  status: Yup.array()
    .of(Yup.string().required('Status is required'))
    .min(1, 'At least one status is required'),
  priority: Yup.string()
    .required('Priority is required')
    .oneOf(['Low', 'Medium', 'High'], 'Priority must be Low, Medium, or High'),
});

export const LOGIN_VALIDATION_SCHEMA = Yup.object().shape({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const SIGNUP_VALIDATION_SCHEMA = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must not exceed 80 characters'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export default TASK_VALIDATION_SCHEMA;
