import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';


export type TaskStatus = 
  | "Paid" 
  | "In Progress" 
  | "Completed"
  | "On Hold"
  | "Canceled"
  | "Approved"
  | "Order from Vendor Confirmed"
  | "Order Checked"
  | "Order Placed"

export interface Task {
  id: number;
  title: string;
  ship: string;
  art: string;
  inHand: string;
  status: TaskStatus[]; // ✅ Change from string to an array
  dueDate: string;
  priority: "High" | "Medium" | "Low";
};

export interface UpdatedTask {
  taskId: number;         
  title: string;         
  art: string;           
  inHand: string;         
  dueDate: string;        
  priority: string;       
  status: string[];       
  notes: {
    critical: string;
    general: string;
    art: string;
    pasted: string;
    images: string[];
  };
  pastedHistory: Array<{
    text: string;
    images: string[];
  }>;
  steps: Array<{
    id: number;
    step: string;
    date: string;
    by: string;
    notes: string;
  }>;
}

export interface StepRow {
  id: number;
  step: string;
  date: string;
  by: string;
  notes: string; 
};

export interface ListProps {
  tasks: Task[];
  totalPages: number;
  currentPage: number;
  itemsPerPage: number; // from slice => state.tasks.limit
  // Thunks
  getTasks: (page: number, limit: number) => void;
  removeTask: (taskId: number) => void;
  updateTask: (updatedTask: Task) => void;
  addTask: (task: Task) => void;
  // Pagination actions
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
};

export interface OrderNotes {
  critical: string;
  general: string;
  art: string;
  // Optional new fields:
  pasted?: any; // for HTML or text
  images?: string[]; // base64-encoded images
};

export interface PastedEntry {
  text: string;
  images: string[];
};

// export interface SavePayload {
//   taskId: number;
//   title: string;
//   art: string;
//   inHand: string;
//   dueDate: string;
//   status: TaskStatus[];
//   notes: OrderNotes;
//   steps: StepRow[];
//   pastedHistory: { text: string; images: string[] }[];
//   priority: 'High' | 'Medium' | 'Low';
// };
export interface SavePayload extends Task {
  // We already have id, ship, title, etc. from Task
  notes: OrderNotes; 
  steps: StepRow[];
  pastedHistory: { text: string; images: string[] }[];
}

export interface StepRow {
  id: number;
  step: string;
  date: string;
  by: string;
  notes: string; 
};

export type StepsByTask = {
  [taskId: string]: StepRow[];
};

export interface NotesByTask {
  [taskId: string]: OrderNotes;
};

export interface PastedDataByTask {
  [taskId: string]: string; 
};

export interface PastedImagesByTask {
  [taskId: string]: string[]; 
};

export interface OrderStepsTableProps {
  taskId: string;
  stepsByTask: StepsByTask;
  setStepsByTask: React.Dispatch<React.SetStateAction<StepsByTask>>;
  notesByTask: NotesByTask;
  setNotesByTask: React.Dispatch<React.SetStateAction<NotesByTask>>;
}

