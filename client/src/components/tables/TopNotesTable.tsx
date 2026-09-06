// TopNotesTable.tsx
import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { PLACEHOLDER_LAST_SAVED_BY } from '../../constants';

export interface OrderNotes {
  critical: string;
  general: string;
  art: string;
  lastSavedBy?: string;
}

interface TopNotesTableProps {
  taskId: number;
  notes: OrderNotes;
  setNotes: React.Dispatch<React.SetStateAction<OrderNotes>>;
}

const LastSavedLabel: React.FC<{ name?: string; placeholder: string }> = ({
  name,
  placeholder,
}) => (
  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
    Last saved by: {name || placeholder}
  </Typography>
);

const TopNotesTable: React.FC<TopNotesTableProps> = ({ notes, setNotes }) => {
  const handleCriticalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes((prev) => ({ ...prev, critical: e.target.value }));
  };
  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes((prev) => ({ ...prev, general: e.target.value }));
  };
  const handleArtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotes((prev) => ({ ...prev, art: e.target.value }));
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell width="25%" sx={{ backgroundColor: '#FFF59D', verticalAlign: 'top' }}>
                <Typography variant="subtitle2">Critical Order Notes</Typography>
              </TableCell>
              <TableCell width="75%">
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  variant="outlined"
                  value={notes.critical}
                  onChange={handleCriticalChange}
                />
                <LastSavedLabel
                  name={notes.lastSavedBy}
                  placeholder={PLACEHOLDER_LAST_SAVED_BY.critical}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ backgroundColor: '#B3E5FC', verticalAlign: 'top' }}>
                <Typography variant="subtitle2">General Order Notes</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  variant="outlined"
                  value={notes.general}
                  onChange={handleGeneralChange}
                />
                <LastSavedLabel
                  name={notes.lastSavedBy}
                  placeholder={PLACEHOLDER_LAST_SAVED_BY.general}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ backgroundColor: '#F8BBD0', verticalAlign: 'top' }}>
                <Typography variant="subtitle2">Art Related Order Notes</Typography>
              </TableCell>
              <TableCell>
                <TextField
                  multiline
                  minRows={2}
                  fullWidth
                  variant="outlined"
                  value={notes.art}
                  onChange={handleArtChange}
                />
                <LastSavedLabel
                  name={notes.lastSavedBy}
                  placeholder={PLACEHOLDER_LAST_SAVED_BY.art}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TopNotesTable;
