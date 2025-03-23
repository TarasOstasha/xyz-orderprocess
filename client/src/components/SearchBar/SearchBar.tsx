// SearchBar.tsx
import React from 'react';
import { TextField } from '@mui/material';

interface SearchBarProps {
  searchQuery: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onChange }) => {
  return (
    <TextField
      label="Search Tasks"
      variant="standard"
      size="small"
      value={searchQuery}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: '500px' }}
    />
  );
};

export default SearchBar;
