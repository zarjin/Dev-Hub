import apiClient from '../../services/axios';
import {
  Team,
  TeamMember,
  CreateTeamDto,
  UpdateTeamDto,
  AddTeamMemberDto,
} from './team.types';
import { mockStorage } from '../../services/mockStorage';

export const teamApi = {
  getTeams: async (organizationId?: string): Promise<Team[]> => {
    try {
      const response = await apiClient.get<Team[]>('/teams', {
        params: { organizationId },
      });
      return response.data;
    } catch {
      return mockStorage.getTeams(organizationId);
    }
  },

  getTeamById: async (id: string): Promise<Team> => {
    try {
      const response = await apiClient.get<Team>(`/teams/${id}`);
      return response.data;
    } catch {
      const team = mockStorage.getTeamById(id);
      if (!team) throw new Error('Team not found');
      return team;
    }
  },

  createTeam: async (dto: CreateTeamDto, createdBy: string): Promise<Team> => {
    try {
      const response = await apiClient.post<Team>('/teams', dto);
      return response.data;
    } catch {
      const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return mockStorage.createTeam({
        organizationId: dto.organizationId,
        name: dto.name,
        slug,
        description: dto.description,
        createdBy,
      });
    }
  },

  updateTeam: async (id: string, dto: UpdateTeamDto): Promise<Team> => {
    try {
      const response = await apiClient.patch<Team>(`/teams/${id}`, dto);
      return response.data;
    } catch {
      return mockStorage.updateTeam(id, dto);
    }
  },

  getTeamMembers: async (teamId: string): Promise<TeamMember[]> => {
    try {
      const response = await apiClient.get<TeamMember[]>(`/teams/${teamId}/members`);
      return response.data;
    } catch {
      return mockStorage.getTeamMembers(teamId);
    }
  },

  addTeamMember: async (teamId: string, dto: AddTeamMemberDto): Promise<TeamMember> => {
    try {
      const response = await apiClient.post<TeamMember>(`/teams/${teamId}/members`, dto);
      return response.data;
    } catch {
      return mockStorage.addTeamMember(teamId, dto.userId, dto.role);
    }
  },
};
