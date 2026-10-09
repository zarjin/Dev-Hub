import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Task,
  TaskActivity,
  Comment,
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  ReviewTaskDto,
  TaskStatus,
} from './task.types';
import { taskApi } from './task.api';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  activities: TaskActivity[];
  comments: Comment[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  filterStatus: TaskStatus | 'all';
  filterPriority: string;
  searchQuery: string;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  activities: [],
  comments: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  filterStatus: 'all',
  filterPriority: 'all',
  searchQuery: '',
};

export const fetchTasks = createAsyncThunk<
  Task[],
  { teamId?: string; organizationId?: string } | undefined,
  { rejectValue: string }
>('tasks/fetchTasks', async (params, { rejectWithValue }) => {
  try {
    return await taskApi.getTasks(params?.teamId, params?.organizationId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to fetch tasks');
  }
});

export const fetchTaskById = createAsyncThunk<Task, string, { rejectValue: string }>(
  'tasks/fetchTaskById',
  async (id, { rejectWithValue }) => {
    try {
      return await taskApi.getTaskById(id);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch task');
    }
  }
);

export const createNewTask = createAsyncThunk<
  Task,
  { dto: CreateTaskDto; createdBy: string },
  { rejectValue: string }
>('tasks/createTask', async ({ dto, createdBy }, { rejectWithValue }) => {
  try {
    return await taskApi.createTask(dto, createdBy);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to create task');
  }
});

export const updateTaskStatus = createAsyncThunk<
  Task,
  { id: string; status: TaskStatus; actorId: string },
  { rejectValue: string }
>('tasks/updateStatus', async ({ id, status, actorId }, { rejectWithValue }) => {
  try {
    return await taskApi.updateTask(id, { status }, actorId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to update task status');
  }
});

export const updateExistingTask = createAsyncThunk<
  Task,
  { id: string; dto: UpdateTaskDto; actorId: string },
  { rejectValue: string }
>('tasks/updateTask', async ({ id, dto, actorId }, { rejectWithValue }) => {
  try {
    return await taskApi.updateTask(id, dto, actorId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to update task');
  }
});

export const reviewTaskAction = createAsyncThunk<
  Task,
  { id: string; review: ReviewTaskDto; actorId: string },
  { rejectValue: string }
>('tasks/reviewTask', async ({ id, review, actorId }, { rejectWithValue }) => {
  try {
    return await taskApi.reviewTask(id, review, actorId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to review task');
  }
});

export const fetchTaskActivities = createAsyncThunk<TaskActivity[], string, { rejectValue: string }>(
  'tasks/fetchActivities',
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskApi.getTaskActivities(taskId);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to load activities');
    }
  }
);

export const fetchTaskComments = createAsyncThunk<Comment[], string, { rejectValue: string }>(
  'tasks/fetchComments',
  async (taskId, { rejectWithValue }) => {
    try {
      return await taskApi.getComments(taskId);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to load comments');
    }
  }
);

export const addCommentToTask = createAsyncThunk<
  Comment,
  { dto: CreateCommentDto; userId: string },
  { rejectValue: string }
>('tasks/addComment', async ({ dto, userId }, { rejectWithValue }) => {
  try {
    return await taskApi.addComment(dto, userId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to post comment');
  }
});

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'all'>) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<string>) => {
      state.filterPriority = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearTaskError: (state) => {
      state.error = null;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch tasks';
      })
      // Fetch task by ID
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.selectedTask = action.payload;
      })
      // Create task
      .addCase(createNewTask.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createNewTask.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createNewTask.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload || 'Failed to create task';
      })
      // Update task / status / review
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) {
          state.tasks[idx] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateExistingTask.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) {
          state.tasks[idx] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(reviewTaskAction.fulfilled, (state, action) => {
        const idx = state.tasks.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) {
          state.tasks[idx] = action.payload;
        }
        if (state.selectedTask?._id === action.payload._id) {
          state.selectedTask = action.payload;
        }
      })
      // Activities
      .addCase(fetchTaskActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      })
      // Comments
      .addCase(fetchTaskComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addCommentToTask.fulfilled, (state, action) => {
        if (!action.payload.parentId) {
          state.comments.push(action.payload);
        } else {
          // Add to parent's replies
          const parent = state.comments.find((c) => c._id === action.payload.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(action.payload);
          } else {
            state.comments.push(action.payload);
          }
        }
      });
  },
});

export const {
  setFilterStatus,
  setFilterPriority,
  setSearchQuery,
  clearTaskError,
  setSelectedTask,
} = taskSlice.actions;

export default taskSlice.reducer;
