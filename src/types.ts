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
  dueDate: string;
  status: TaskStatus[]; // ✅ Change from string to an array
  priority: "High" | "Medium" | "Low";
}

