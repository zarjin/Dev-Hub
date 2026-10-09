import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Team,
  TeamMember,
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from './team.types';
import { teamApi } from './team.api';

export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  teams: [],
  currentTeam: null,
  members: [],
  isLoading: false,
  error: null,
};

export const fetchTeams = createAsyncThunk<Team[], string | void, { rejectValue: string }>(
  'teams/fetchTeams',
  async (organizationId, { rejectWithValue }) => {
    try {
      return await teamApi.getTeams(organizationId || undefined);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

export const fetchTeamById = createAsyncThunk<Team, string, { rejectValue: string }>(
  'teams/fetchTeamById',
  async (id, { rejectWithValue }) => {
    try {
      return await teamApi.getTeamById(id);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch team');
    }
  }
);

export const createNewTeam = createAsyncThunk<
  Team,
  { dto: CreateTeamDto; createdBy: string },
  { rejectValue: string }
>('teams/createTeam', async ({ dto, createdBy }, { rejectWithValue }) => {
  try {
    return await teamApi.createTeam(dto, createdBy);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to create team');
  }
});

export const updateTeamDetails = createAsyncThunk<
  Team,
  { id: string; dto: UpdateTeamDto },
  { rejectValue: string }
>('teams/updateTeam', async ({ id, dto }, { rejectWithValue }) => {
  try {
    return await teamApi.updateTeam(id, dto);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to update team');
  }
});

export const fetchTeamMembers = createAsyncThunk<TeamMember[], string, { rejectValue: string }>(
  'teams/fetchTeamMembers',
  async (teamId, { rejectWithValue }) => {
    try {
      return await teamApi.getTeamMembers(teamId);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || 'Failed to fetch team members');
    }
  }
);

export const addTeamMember = createAsyncThunk<
  TeamMember,
  { teamId: string; dto: AddTeamMemberDto },
  { rejectValue: string }
>('teams/addTeamMember', async ({ teamId, dto }, { rejectWithValue }) => {
  try {
    return await teamApi.addTeamMember(teamId, dto);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to add team member');
  }
});

export const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    setCurrentTeam: (state, action: PayloadAction<Team | null>) => {
      state.currentTeam = action.payload;
    },
    clearTeamError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teams
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
        if (!state.currentTeam && action.payload.length > 0) {
          state.currentTeam = action.payload[0];
        }
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch teams';
      })
      // Fetch team by ID
      .addCase(fetchTeamById.fulfilled, (state, action) => {
        state.currentTeam = action.payload;
      })
      // Create team
      .addCase(createNewTeam.fulfilled, (state, action) => {
        state.teams.unshift(action.payload);
        state.currentTeam = action.payload;
      })
      // Update team
      .addCase(updateTeamDetails.fulfilled, (state, action) => {
        const index = state.teams.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.teams[index] = action.payload;
        }
        if (state.currentTeam?._id === action.payload._id) {
          state.currentTeam = action.payload;
        }
      })
      // Team members
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      });
  },
});

export const { setCurrentTeam, clearTeamError } = teamSlice.actions;
export default teamSlice.reducer;
