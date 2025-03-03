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
}

