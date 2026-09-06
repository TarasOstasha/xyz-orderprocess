import React from 'react';
import { Box, Typography } from '@mui/material';
import { CURRENT_USER } from '../../constants';

/** Placeholder account display — swap CURRENT_USER for real auth later */
const Header: React.FC = () => {
  return (
    <Box
      component="header"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={3}
      py={1.5}
      sx={{
        backgroundColor: '#1e1e1e',
        color: '#fff',
        borderBottom: '1px solid #333',
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        XYZ Order Process
      </Typography>

      <Box textAlign="right">
        <Typography variant="caption" sx={{ color: '#aaa', display: 'block', lineHeight: 1.2 }}>
          Signed in as
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {CURRENT_USER.name}
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
