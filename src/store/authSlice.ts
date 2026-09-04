import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  role: 'customer' | 'admin';
  loading: boolean;
  error: string | null;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('proprint_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();

const initialState: AuthState = {
  currentUser: initialUser,
  isAuthenticated: !!initialUser,
  role: initialUser?.role === 'admin' ? 'admin' : 'customer',
  loading: false,
  error: null,
};

export const loginUserThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password?: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to login');
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return rejectWithValue(data.error || 'Registration failed');
      }
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      state.role = action.payload?.role === 'admin' ? 'admin' : 'customer';
      if (action.payload) {
        localStorage.setItem('proprint_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('proprint_user');
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.role = 'customer';
      localStorage.removeItem('proprint_user');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.role = action.payload.role || 'customer';
        localStorage.setItem('proprint_user', JSON.stringify(action.payload.user));
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.role = action.payload.user?.role || 'customer';
        localStorage.setItem('proprint_user', JSON.stringify(action.payload.user));
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
