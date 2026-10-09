import apiClient from '../../services/axios';
import {
  Organization,
  OrganizationMember,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  InviteOrganizationMemberDto,
} from './organization.types';
import { mockStorage } from '../../services/mockStorage';

export const organizationApi = {
  getOrganizations: async (): Promise<Organization[]> => {
    try {
      const response = await apiClient.get<Organization[]>('/organizations');
      return response.data;
    } catch {
      return mockStorage.getOrganizations();
    }
  },

  getOrganizationById: async (id: string): Promise<Organization> => {
    try {
      const response = await apiClient.get<Organization>(`/organizations/${id}`);
      return response.data;
    } catch {
      const org = mockStorage.getOrganizationById(id);
      if (!org) throw new Error('Organization not found');
      return org;
    }
  },

  createOrganization: async (
    dto: CreateOrganizationDto,
    ownerId: string
  ): Promise<Organization> => {
    try {
      const response = await apiClient.post<Organization>('/organizations', dto);
      return response.data;
    } catch {
      const slug = dto.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return mockStorage.createOrganization({
        name: dto.name,
        slug,
        description: dto.description,
        logo:
          dto.logo ||
          'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        ownerId,
      });
    }
  },

  updateOrganization: async (
    id: string,
    dto: UpdateOrganizationDto
  ): Promise<Organization> => {
    try {
      const response = await apiClient.patch<Organization>(`/organizations/${id}`, dto);
      return response.data;
    } catch {
      return mockStorage.updateOrganization(id, dto);
    }
  },

  getMembers: async (organizationId: string): Promise<OrganizationMember[]> => {
    try {
      const response = await apiClient.get<OrganizationMember[]>(
        `/organizations/${organizationId}/members`
      );
      return response.data;
    } catch {
      return mockStorage.getOrgMembers(organizationId);
    }
  },

  inviteMember: async (
    organizationId: string,
    dto: InviteOrganizationMemberDto
  ): Promise<OrganizationMember> => {
    try {
      const response = await apiClient.post<OrganizationMember>(
        `/organizations/${organizationId}/members`,
        dto
      );
      return response.data;
    } catch {
      return mockStorage.addOrgMember(organizationId, dto.email, dto.role);
    }
  },
};
