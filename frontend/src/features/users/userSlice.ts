import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User, UpdateUserProfileDto } from './user.types';
import { userApi } from './user.api';

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getUsers();
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk<User, string, { rejectValue: string }>(
  'users/fetchUserById',
  async (id, { rejectWithValue }) => {
    try {
      return await userApi.getUserById(id);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

export const updateUserProfile = createAsyncThunk<
  User,
  { id: string; updates: UpdateUserProfileDto },
  { rejectValue: string }
>('users/updateUserProfile', async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await userApi.updateProfile(id, updates);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to update user profile');
  }
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      })
      // Fetch user by id
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
