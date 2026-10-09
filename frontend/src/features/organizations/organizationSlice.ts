import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Organization,
  OrganizationMember,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  InviteOrganizationMemberDto,
} from './organization.types';
import { organizationApi } from './organization.api';

export interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  members: OrganizationMember[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  members: [],
  isLoading: false,
  error: null,
};

export const fetchOrganizations = createAsyncThunk<
  Organization[],
  void,
  { rejectValue: string }
>('organizations/fetchOrganizations', async (_, { rejectWithValue }) => {
  try {
    return await organizationApi.getOrganizations();
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to fetch organizations');
  }
});

export const fetchOrganizationById = createAsyncThunk<
  Organization,
  string,
  { rejectValue: string }
>('organizations/fetchOrganizationById', async (id, { rejectWithValue }) => {
  try {
    return await organizationApi.getOrganizationById(id);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to fetch organization');
  }
});

export const createNewOrganization = createAsyncThunk<
  Organization,
  { dto: CreateOrganizationDto; ownerId: string },
  { rejectValue: string }
>('organizations/createOrganization', async ({ dto, ownerId }, { rejectWithValue }) => {
  try {
    return await organizationApi.createOrganization(dto, ownerId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to create organization');
  }
});

export const updateOrgDetails = createAsyncThunk<
  Organization,
  { id: string; dto: UpdateOrganizationDto },
  { rejectValue: string }
>('organizations/updateOrganization', async ({ id, dto }, { rejectWithValue }) => {
  try {
    return await organizationApi.updateOrganization(id, dto);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to update organization');
  }
});

export const fetchOrgMembers = createAsyncThunk<
  OrganizationMember[],
  string,
  { rejectValue: string }
>('organizations/fetchOrgMembers', async (orgId, { rejectWithValue }) => {
  try {
    return await organizationApi.getMembers(orgId);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to fetch members');
  }
});

export const inviteOrgMember = createAsyncThunk<
  OrganizationMember,
  { orgId: string; dto: InviteOrganizationMemberDto },
  { rejectValue: string }
>('organizations/inviteOrgMember', async ({ orgId, dto }, { rejectWithValue }) => {
  try {
    return await organizationApi.inviteMember(orgId, dto);
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || 'Failed to invite member');
  }
});

export const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    setCurrentOrganization: (state, action: PayloadAction<Organization | null>) => {
      state.currentOrganization = action.payload;
    },
    clearOrgError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch organizations
      .addCase(fetchOrganizations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.organizations = action.payload;
        if (!state.currentOrganization && action.payload.length > 0) {
          state.currentOrganization = action.payload[0];
        }
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load organizations';
      })
      // Fetch organization by ID
      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.currentOrganization = action.payload;
      })
      // Create Organization
      .addCase(createNewOrganization.fulfilled, (state, action) => {
        state.organizations.unshift(action.payload);
        state.currentOrganization = action.payload;
      })
      // Update Organization
      .addCase(updateOrgDetails.fulfilled, (state, action) => {
        const index = state.organizations.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.organizations[index] = action.payload;
        }
        if (state.currentOrganization?._id === action.payload._id) {
          state.currentOrganization = action.payload;
        }
      })
      // Members
      .addCase(fetchOrgMembers.fulfilled, (state, action) => {
        state.members = action.payload;
      })
      .addCase(inviteOrgMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      });
  },
});

export const { setCurrentOrganization, clearOrgError } = organizationSlice.actions;
export default organizationSlice.reducer;
