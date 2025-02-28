export type TaskStatus = 
  | "Pending" 
  | "In Progress" 
  | "Completed"
  | "On Hold"
  | "Canceled"
  | "Review"
  | "Blocked";

export interface Task {
  id: number;
  title: string;
  ship: string;
  art: string;
  inHand: string;
  status: TaskStatus[]; // ✅ Change from string to an array
  dueDate: string;
  priority: "High" | "Medium" | "Low";
}

