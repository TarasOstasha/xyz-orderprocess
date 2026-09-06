import { v4 as uuidv4 } from 'uuid';
import { TaskStatus, StepRow, Task } from './types';
import { GridColDef } from '@mui/x-data-grid';

/** Temporary account — replace with real auth user later */
export const CURRENT_USER = {
  id: 'local-1',
  name: 'Tony Joss',
  email: 'tonyjoss1990@gmail.com',
};

/** Placeholder coworkers on a task — replace with live presence later */
export const MOCK_USERS_ON_TASK = [
  { userId: 'local-2', name: 'Alex Rivera' },
  { userId: 'local-3', name: 'Sam Chen' },
];

/** Demo “last saved by” labels for empty fields — replace with real save metadata later */
export const PLACEHOLDER_LAST_SAVED_BY = {
  critical: 'Alex Rivera',
  general: 'Sam Chen',
  art: 'Tony Joss',
  step: 'Alex Rivera',
};

// All possible statuses
export const ALL_STATUSES: TaskStatus[] = [
  'Paid',
  'In Progress',
  'Completed',
  'On Hold',
  'Canceled',
  'Approved',
  'Order from Vendor Confirmed',
  'Order Checked',
  'Order Placed',
];

// Default steps for each task
export const defaultRows: StepRow[] = [
  { id: 1, step: 'PAYMENT PROCESSED', date: '', by: '', notes: '', lastSavedBy: 'Tony Joss' },
  { id: 2, step: 'Order Placed', date: '', by: '', notes: '', lastSavedBy: 'Alex Rivera' },
  { id: 3, step: 'Order Checked', date: '', by: '', notes: '', lastSavedBy: 'Sam Chen' },
  { id: 4, step: 'Vendor Confirmation Checked', date: '', by: '', notes: '', lastSavedBy: 'Alex Rivera' },
  { id: 5, step: 'Graphics Sent to Vendor', date: '', by: '', notes: '', lastSavedBy: 'Tony Joss' },
  { id: 6, step: 'Vendor Proof Sent to Client', date: '', by: '', notes: '', lastSavedBy: 'Sam Chen' },
  { id: 7, step: 'Client Approval Sent to Vendor', date: '', by: '', notes: '', lastSavedBy: 'Alex Rivera' },
  { id: 8, step: 'Order Shipped', date: '2/17', by: '', notes: '', lastSavedBy: 'Tony Joss' },
  { id: 9, step: 'Pictures Sent to Client', date: '', by: '', notes: '', lastSavedBy: 'Sam Chen' },
];

// For Add Task dialog
export const initialValues: Task = {
  id: parseInt(
    uuidv4()
      .replace(/[^0-9]/g, '')
      .slice(0, 10),
    10
  ),
  title: '',
  ship: '',
  art: '',
  inHand: '',
  dueDate: '',
  status: [],
  priority: '' as 'High' | 'Medium' | 'Low',
};

export const columns: GridColDef[] = [
  { field: 'step', headerName: 'Step', width: 220, editable: false },
  { field: 'date', headerName: 'Date', width: 90, editable: true },
  { field: 'by', headerName: 'By', width: 60, editable: true },
  { field: 'notes', headerName: 'Notes', flex: 1, minWidth: 160, editable: true },
  {
    field: 'lastSavedBy',
    headerName: 'Saved by',
    width: 100,
    maxWidth: 110,
    flex: 0,
    editable: false,
    align: 'right',
    headerAlign: 'right',
  },
];
