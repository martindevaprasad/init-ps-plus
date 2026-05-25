import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  users: User[];
}

// Demo user for offline mode
const DEMO_USER: User = {
  id: 'demo-admin-001',
  username: 'Admin',
  email: 'admin@bakery.com',
  role: 'admin',
  permissions: ['create_order', 'view_reports', 'edit_inventory', 'manage_users'],
  isActive: true,
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEMO_USERS: User[] = [
  DEMO_USER,
  { id: 'demo-mgr-001', username: 'Sarah Manager', email: 'sarah@bakery.com', role: 'manager', permissions: ['view_reports', 'edit_inventory'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'demo-cash-001', username: 'John Cashier', email: 'john@bakery.com', role: 'cashier', permissions: ['create_order'], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'demo-kit-001', username: 'Maria Kitchen', email: 'maria@bakery.com', role: 'kitchen', permissions: [], isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('pos_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: DEMO_USERS,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('pos_token', data.data.token);
        return data.data;
      }
      throw new Error('Backend unavailable');
    } catch {
      // Demo fallback
      if (email === 'admin@bakery.com' && password === 'password123') {
        const token = 'demo-token-' + Date.now();
        localStorage.setItem('pos_token', token);
        return { token, user: DEMO_USER };
      }
      return rejectWithValue('Invalid email or password');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('pos_token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    addUser(state, action: PayloadAction<User>) { state.users.push(action.payload); },
    updateUserInList(state, action: PayloadAction<User>) {
      const idx = state.users.findIndex(u => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    deleteUserFromList(state, action: PayloadAction<string>) {
      state.users = state.users.filter(u => u.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, addUser, updateUserInList, deleteUserFromList } = authSlice.actions;
export default authSlice.reducer;
