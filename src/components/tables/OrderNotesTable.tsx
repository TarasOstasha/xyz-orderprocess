// OrderStepsTable.tsx
import React from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";

// Same row structure as before
export interface StepRow {
  id: number;
  step: string;
  date: string;
  by: string;
  notes: string; // user edits this
}

// Dictionary type: each taskId maps to an array of StepRow
export type StepsByTask = {
  [taskId: string]: StepRow[];
};

// Columns: Step, Date, By are read-only, Notes is editable
const columns: GridColDef[] = [
  { field: "step",  headerName: "Step",  width: 220, editable: false },
  { field: "date",  headerName: "Date",  width: 90,  editable: false },
  { field: "by",    headerName: "By",    width: 60,  editable: false },
  { field: "notes", headerName: "Notes", width: 300, editable: true },
];

// Props for the OrderStepsTable
interface OrderStepsTableProps {
  taskId: string;  // Which task are we showing?
  stepsByTask: StepsByTask; // All tasks' data
  setStepsByTask: React.Dispatch<React.SetStateAction<StepsByTask>>; // So we can update the parent
}

const OrderStepsTable: React.FC<OrderStepsTableProps> = ({
  taskId,
  stepsByTask,
  setStepsByTask
}) => {
  // Get *just* the rows for the current task
  const rows = stepsByTask[taskId] || [];

  // Called whenever user edits a row (the "Notes" column)
  const handleProcessRowUpdate = (newRowModel: GridRowModel) => {
    const updatedRow = newRowModel as StepRow;

    // Update only the current task's array in the dictionary
    setStepsByTask((prev) => {
      const newData = { ...prev };            // clone the entire dictionary
      const oldRows = newData[taskId] || [];
      const updatedRows = oldRows.map((row) =>
        row.id === updatedRow.id ? updatedRow : row
      );
      newData[taskId] = updatedRows;          // put updated array back
      return newData;
    });

    return updatedRow; // required by MUI
  };

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Steps
      </Typography>

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          // If you're on MUI X v6 or later, remove this experimentalFeatures line
        //   experimentalFeatures={{ newEditingApi: true }}
          sx={{
            // Same color scheme: rows 1-3 = green, 4-6 = pink, 7-9 = blue
            "& .MuiDataGrid-row:nth-of-type(1)": { backgroundColor: "#90EE90" },
            "& .MuiDataGrid-row:nth-of-type(2)": { backgroundColor: "#90EE90" },
            "& .MuiDataGrid-row:nth-of-type(3)": { backgroundColor: "#90EE90" },

            "& .MuiDataGrid-row:nth-of-type(4)": { backgroundColor: "#FFC0CB" },
            "& .MuiDataGrid-row:nth-of-type(5)": { backgroundColor: "#FFC0CB" },
            "& .MuiDataGrid-row:nth-of-type(6)": { backgroundColor: "#FFC0CB" },

            "& .MuiDataGrid-row:nth-of-type(7)": { backgroundColor: "#ADD8E6" },
            "& .MuiDataGrid-row:nth-of-type(8)": { backgroundColor: "#ADD8E6" },
            "& .MuiDataGrid-row:nth-of-type(9)": { backgroundColor: "#ADD8E6" },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderStepsTable;
