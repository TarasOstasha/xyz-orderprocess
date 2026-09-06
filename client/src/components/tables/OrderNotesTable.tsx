// OrderStepsTable.tsx
import React, { useEffect } from 'react';
import { DataGrid, GridColDef, GridRowModel } from '@mui/x-data-grid';
import { Box, Typography, Button } from '@mui/material';
import TopNotesTable from './TopNotesTable';
import { StepRow, OrderStepsTableProps } from '../../types';
import { columns, PLACEHOLDER_LAST_SAVED_BY, MOCK_USERS_ON_TASK, CURRENT_USER } from '../../constants';



const OrderStepsTable: React.FC<OrderStepsTableProps> = ({
  taskId,
  stepsByTask,
  setStepsByTask,
  notesByTask,
  setNotesByTask,
  selectedTask
}) => {
  // Grab rows for this task — fill empty lastSavedBy with placeholders for demo look
  const placeholderNames = [
    CURRENT_USER.name,
    ...MOCK_USERS_ON_TASK.map((u) => u.name),
    PLACEHOLDER_LAST_SAVED_BY.step,
  ];
  const rows = (stepsByTask[taskId] || []).map((row, index) => ({
    ...row,
    lastSavedBy: row.lastSavedBy || placeholderNames[index % placeholderNames.length],
  }));

  // Grab the notes for this task, or default to empty
  const notesForThisTask = notesByTask[taskId] || {
    critical: '',
    general: '',
    art: '',
  };

  useEffect(() => { 
    // If the selected task changes, update the steps and notes for that task
    console.log(JSON.stringify(notesForThisTask), 'notesForThisTask')
    console.log(selectedTask, 'selectedTask')
  }, [selectedTask]);

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

  useEffect(() => {
    if (!selectedTask) return;
  
    setNotesByTask((prev) => {
      // If we already initialized this task’s notes, do nothing
      if (prev[selectedTask.id]) return prev;
  
      // Otherwise pull them straight from selectedTask.Note
      const serverNotes = selectedTask.Note || {};
      return {
        ...prev,
        [selectedTask.id]: {
          critical: serverNotes.critical || '',
          general:  serverNotes.general  || '',
          art:      serverNotes.art      || '',
          lastSavedBy: (serverNotes as { lastSavedBy?: string }).lastSavedBy || '',
        },
      };
    });
  }, [selectedTask]);

  useEffect(() => {
    if (!selectedTask || selectedTask.Steps?.length === 0) return;
    setStepsByTask((prev) => ({
      ...prev,
      [selectedTask.id]: selectedTask.Steps || []
    }));
  }, [selectedTask]);


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

      <Box sx={{ height: 700 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          disableColumnResize={false}
          sx={{
            width: '100%',
            '& .MuiDataGrid-main': { width: '100%' },
            '& .MuiDataGrid-virtualScroller': { overflowX: 'hidden' },
            '& .MuiDataGrid-columnHeaders': { width: '100% !important' },
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
