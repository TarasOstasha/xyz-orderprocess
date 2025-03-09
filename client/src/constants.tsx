import { v4 as uuidv4 } from 'uuid';
import { TaskStatus, StepRow, Task } from './types';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';

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
  { id: 1, step: 'PAYMENT PROCESSED', date: '', by: '', notes: '' },
  { id: 2, step: 'Order Placed', date: '', by: '', notes: '' },
  { id: 3, step: 'Order Checked', date: '', by: '', notes: '' },
  { id: 4, step: 'Vendor Confirmation Checked', date: '', by: '', notes: '' },
  { id: 5, step: 'Graphics Sent to Vendor', date: '', by: '', notes: '' },
  { id: 6, step: 'Vendor Proof Sent to Client', date: '', by: '', notes: '' },
  { id: 7, step: 'Client Approval Sent to Vendor', date: '', by: '', notes: '' },
  { id: 8, step: 'Order Shipped', date: '2/17', by: '', notes: '' },
  { id: 9, step: 'Pictures Sent to Client', date: '', by: '', notes: '' },
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
    { field: 'notes', headerName: 'Notes', width: 300, editable: true },
  ];