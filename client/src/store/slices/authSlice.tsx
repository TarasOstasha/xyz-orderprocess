import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import * as API from '../../api';
import { getStoredToken, persistToken } from '../../utils/authStorage';
import {
  getDemoUserFromToken,
  isDemoModeEnabled,
  isDemoToken,
  tryDemoLogin,
} from '../../utils/demoAuth';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  bootstrapped: boolean;
}

const initialState: AuthState = {
  user: null,
  token: getStoredToken(),
  status: 'idle',
  error: null,
  bootstrapped: false,
};

function extractErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as AxiosError<{ message?: string } | Array<{ message?: string }>>;
  const data = axiosErr.response?.data;
  if (Array.isArray(data) && data[0]?.message) {
    return data[0].message;
  }
  if (data && !Array.isArray(data) && data.message) {
    return data.message;
  }
  return fallback;
}

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    payload: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    if (isDemoModeEnabled()) {
      return rejectWithValue('Sign up is disabled in demo mode');
    }
    try {
      const { data } = await API.signup(payload);
      return data as { token: string; user: AuthUser };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Sign up failed'));
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    // Vercel-only / no-API demo: check env credentials in the browser
    if (isDemoModeEnabled()) {
      const demo = tryDemoLogin(payload.email, payload.password);
      if (demo) return demo;
      return rejectWithValue('Invalid email or password');
    }

    try {
      const { data } = await API.login(payload);
      return data as { token: string; user: AuthUser };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Login failed'));
    }
  }
);

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  const token = getStoredToken();
  if (isDemoToken(token)) {
    const user = getDemoUserFromToken(token!);
    if (user) return user;
    return rejectWithValue('Session expired');
  }

  try {
    const { data } = await API.getMe();
    return data.user as AuthUser;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err, 'Session expired'));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.bootstrapped = true;
      persistToken(null);
    },
    clearAuthError(state) {
      state.error = null;
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.bootstrapped = true;
        persistToken(action.payload.token);
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Sign up failed';
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.bootstrapped = true;
        persistToken(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Login failed';
      })
      .addCase(fetchMe.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.bootstrapped = true;
        state.error = null;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.status = 'idle';
        state.user = null;
        state.token = null;
        state.bootstrapped = true;
        persistToken(null);
      });
  },
});

const { reducer, actions } = authSlice;

export const { logout, clearAuthError, setBootstrapped } = actions;
export default reducer;
