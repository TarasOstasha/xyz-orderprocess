// OrderStepsTable.tsx
import React from "react";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import TopNotesTable from "./TopNotesTable";

export interface OrderNotes {
  critical: string;
  general: string;
  art: string;
}

export interface StepRow {
  id: number;
  step: string;
  date: string;
  by: string;
  notes: string; // user edits this
}

export type StepsByTask = {
  [taskId: string]: StepRow[];
};

// 1) Add a type for the dictionary that maps each taskId to its notes
type NotesByTask = {
  [taskId: string]: OrderNotes;
};

const columns: GridColDef[] = [
  { field: "step",  headerName: "Step",  width: 220, editable: false },
  { field: "date",  headerName: "Date",  width: 90,  editable: true },
  { field: "by",    headerName: "By",    width: 60,  editable: true },
  { field: "notes", headerName: "Notes", width: 300, editable: true },
];

// 2) Make sure your interface has commas or semicolons in the right places
interface OrderStepsTableProps {
  taskId: string;
  stepsByTask: StepsByTask;
  setStepsByTask: React.Dispatch<React.SetStateAction<StepsByTask>>;

  notesByTask: NotesByTask; 
  setNotesByTask: React.Dispatch<React.SetStateAction<NotesByTask>>;
}

const OrderStepsTable: React.FC<OrderStepsTableProps> = ({
  taskId,
  stepsByTask,
  setStepsByTask,
  notesByTask,
  setNotesByTask
}) => {
  // Grab rows for this task
  const rows = stepsByTask[taskId] || [];

  // Grab the notes for this task, or default to empty
  const notesForThisTask = notesByTask[taskId] || {
    critical: "",
    general: "",
    art: "",
  };

  // Called whenever user edits a row in the DataGrid
  const handleProcessRowUpdate = (newRowModel: GridRowModel) => {
    const updatedRow = newRowModel as StepRow;
    setStepsByTask((prev) => {
      const newData = { ...prev };
      const oldRows = newData[taskId] || [];
      const updatedRows = oldRows.map((row) =>
        row.id === updatedRow.id ? updatedRow : row
      );
      newData[taskId] = updatedRows;
      return newData;
    });
    return updatedRow;
  };

  return (
    <Box sx={{ width: "100%", marginTop: 2 }}>
      {/* Top table for notes */}
      <TopNotesTable
        taskId={taskId}
        notes={notesForThisTask}
        // Wrap setNotesByTask so it updates only notes for *this* task
        setNotes={(updater) => {
          setNotesByTask((prev) => {
            const oldNotes = prev[taskId] || { critical: "", general: "", art: "" };
            const newNotes =
              typeof updater === "function" ? updater(oldNotes) : updater;
            return {
              ...prev,
              [taskId]: newNotes,
            };
          });
        }}
      />

      <Typography variant="h6" gutterBottom>
        Order Steps
      </Typography>

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          sx={{
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
