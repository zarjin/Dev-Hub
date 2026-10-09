import { User } from '../users/user.types';

export type TeamRole = 'team_lead' | 'developer' | 'designer' | 'viewer';
export type TeamMemberStatus = 'active' | 'invited' | 'removed';

export interface Team {
  _id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  status: TeamMemberStatus;
  joinedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User; // Populated member details
}

export interface CreateTeamDto {
  organizationId: string;
  name: string;
  description: string;
}

export interface UpdateTeamDto {
  name?: string;
  description?: string;
}

export interface AddTeamMemberDto {
  userId: string;
  role: TeamRole;
}
