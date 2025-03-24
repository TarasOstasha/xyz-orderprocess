// OrderStepsTable.tsx
import React from 'react';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import TopNotesTable from './TopNotesTable';
import { StepRow, OrderStepsTableProps } from '../../types';
import { columns } from '../../constants';



const OrderStepsTable: React.FC<OrderStepsTableProps> = ({
  taskId,
  stepsByTask,
  setStepsByTask,
  notesByTask,
  setNotesByTask
}) => {
  // Grab rows for this task
  const rows = stepsByTask[taskId] || [];
  console.log(notesByTask, 'notesByTask');
  // Grab the notes for this task, or default to empty
  const notesForThisTask = notesByTask[taskId] || {
    critical: '',
    general: '',
    art: '',
  };

  // Called whenever user edits a row in the DataGrid
  const handleProcessRowUpdate = (newRowModel: GridRowModel) => {
    const updatedRow = newRowModel as StepRow;
    setStepsByTask((prev) => {
      const newData = { ...prev };
      const oldRows = newData[taskId] || [];
      const updatedRows = oldRows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
      newData[taskId] = updatedRows;
      return newData;
    });
    return updatedRow;
  };


  return (
    <Box sx={{ width: '100%', marginTop: 2, position: 'relative' }}>
      {/* Top table for notes */}
      <TopNotesTable
        taskId={taskId}
        notes={notesForThisTask}
        // Wrap setNotesByTask so it updates only notes for *this* task
        setNotes={(updater) => {
          setNotesByTask((prev) => {
            const oldNotes = prev[taskId] || { critical: '', general: '', art: '' };
            const newNotes = typeof updater === 'function' ? updater(oldNotes) : updater;
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
      {/* <Box sx={{ width: '100%', mt: 2, mb: 2, position: 'absolute', bottom: '0' }}>
        <Button variant="contained" color="success" fullWidth onClick={handleSaveTask}>
          Save Task
        </Button>
      </Box> */}
      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          sx={{
            '& .MuiDataGrid-row:nth-of-type(1)': { backgroundColor: '#90EE90' },
            '& .MuiDataGrid-row:nth-of-type(2)': { backgroundColor: '#90EE90' },
            '& .MuiDataGrid-row:nth-of-type(3)': { backgroundColor: '#90EE90' },

            '& .MuiDataGrid-row:nth-of-type(4)': { backgroundColor: '#FFC0CB' },
            '& .MuiDataGrid-row:nth-of-type(5)': { backgroundColor: '#FFC0CB' },
            '& .MuiDataGrid-row:nth-of-type(6)': { backgroundColor: '#FFC0CB' },

            '& .MuiDataGrid-row:nth-of-type(7)': { backgroundColor: '#ADD8E6' },
            '& .MuiDataGrid-row:nth-of-type(8)': { backgroundColor: '#ADD8E6' },
            '& .MuiDataGrid-row:nth-of-type(9)': { backgroundColor: '#ADD8E6' },
          }}
        />
      </Box>
    </Box>
  );
};

export default OrderStepsTable;
