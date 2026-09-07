import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchMe, setBootstrapped } from '../store/slices/authSlice';

const ProtectedRoute: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, bootstrapped } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!token) {
      dispatch(setBootstrapped(true));
      return;
    }
    if (!user) {
      dispatch(fetchMe());
    } else if (!bootstrapped) {
      dispatch(setBootstrapped(true));
    }
  }, [dispatch, token, user, bootstrapped]);

  if (!bootstrapped) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
