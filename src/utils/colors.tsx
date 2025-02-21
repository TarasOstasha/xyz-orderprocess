export type TaskStatus = 
  | "Pending" 
  | "In Progress" 
  | "Completed"
  | "On Hold"
  | "Canceled"
  | "Review"
  | "Blocked";


export const statusColors: Record<TaskStatus, string> = {
    Pending: '#FFA500', // Orange
    'In Progress': '#007BFF', // Blue
    Completed: '#28A745', // Green
    'On Hold': '#808080', // Gray
    Canceled: '#FF0000', // Red
    Review: '#FFC107', // Yellow
    Blocked: '#DC3545', // Dark Red
  };