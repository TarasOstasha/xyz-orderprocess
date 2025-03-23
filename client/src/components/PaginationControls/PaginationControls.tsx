// src/components/PaginationControls/PaginationControls.tsx

import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Pagination from '@mui/material/Pagination';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (limit: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ width: '600px', mb: 2 }}
    >
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Items Per Page</InputLabel>
        <Select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          label="Items Per Page"
        >
          {[5, 25, 100].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(event, value) => onPageChange(value)}
        color="primary"
      />
    </Box>
  );
};

export default PaginationControls;
