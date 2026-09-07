import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import {
  Alert,
  Box,
  Button,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { clearAuthError, login } from '../../store/slices/authSlice';
import { LOGIN_VALIDATION_SCHEMA } from '../../utils/validationSchemas';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{
        background: 'linear-gradient(160deg, #1e1e1e 0%, #2a2a2a 45%, #3d3d3d 100%)',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 420,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          XYZ Order Process
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sign in to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LOGIN_VALIDATION_SCHEMA}
          onSubmit={async (values) => {
            const result = await dispatch(login(values));
            if (login.fulfilled.match(result)) {
              navigate('/', { replace: true });
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
                fullWidth
                margin="dense"
                autoComplete="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email ? errors.email : ''}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                fullWidth
                margin="dense"
                autoComplete="current-password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password ? errors.password : ''}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, py: 1.2, backgroundColor: '#1e1e1e' }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Signing in…' : 'Sign in'}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography variant="body2" mt={2.5} textAlign="center">
          No account?{' '}
          <Link component={RouterLink} to="/signup" underline="hover">
            Sign up
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
