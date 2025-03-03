export type TaskStatus = 
  | "Paid" 
  | "In Progress" 
  | "Completed"
  | "On Hold"
  | "Canceled"
  | "Order Checked"
  | "Approved"
  | "Order Placed"
  | "Order from Vendor Confirmed"


export const statusColors: Record<TaskStatus, string> = {
    Paid: '#f05fb5', // Orange
    'In Progress': '#007BFF', // Blue
    Completed: '#28A745', // Green
    'On Hold': '#808080', // Gray
    Canceled: '#FF0000', // Red
    'Order Checked': '#54cd90', // Yellow
    Approved: '#5da9e5', // Dark Red
    'Order Placed': '#dbc157',
    'Order from Vendor Confirmed': '#c8cdd2', 
  };



 
  // | "In Progress" 
  // | "Completed"
  // | "On Hold"
  // | "Canceled"

  // | "Order from Vendor Confirmed"

