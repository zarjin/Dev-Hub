import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, LoginDto, RegisterDto, AuthResponse } from './auth.types';
import { authApi } from './auth.api';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('devhub_token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, LoginDto, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await authApi.login(credentials);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterDto, { rejectValue: string }>(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      return await authApi.register(data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
  }
);

export const checkAuth = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return await authApi.getCurrentUser();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(error.response?.data?.message || 'Session expired');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentUser: (state, action: PayloadAction<AuthResponse['user']>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });
  },
});

export const { clearError, setCurrentUser } = authSlice.actions;
export default authSlice.reducer;
