import { User } from '../users/user.types';

export type OrganizationRole = 'owner' | 'admin' | 'member';
export type MemberStatus = 'active' | 'invited' | 'suspended';

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMember {
  _id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  status: MemberStatus;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User; // Populated member details
}

export interface CreateOrganizationDto {
  name: string;
  description: string;
  logo?: string;
}

export interface UpdateOrganizationDto {
  name?: string;
  description?: string;
  logo?: string;
}

export interface InviteOrganizationMemberDto {
  email: string;
  role: OrganizationRole;
}
