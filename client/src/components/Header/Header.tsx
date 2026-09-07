import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

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

      <Box display="flex" alignItems="center" gap={2}>
        <Box textAlign="right">
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block', lineHeight: 1.2 }}>
            Signed in as
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user?.name || '…'}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          onClick={handleLogout}
          sx={{
            color: '#fff',
            borderColor: '#666',
            textTransform: 'none',
            '&:hover': { borderColor: '#aaa', backgroundColor: 'rgba(255,255,255,0.06)' },
          }}
        >
          Log out
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
