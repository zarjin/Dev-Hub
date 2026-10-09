import { OrganizationRole } from '../features/organizations/organization.types';
import { TeamRole } from '../features/teams/team.types';

export const ORG_ROLES = {
  OWNER: 'owner' as OrganizationRole,
  ADMIN: 'admin' as OrganizationRole,
  MEMBER: 'member' as OrganizationRole,
};

export const TEAM_ROLES = {
  TEAM_LEAD: 'team_lead' as TeamRole,
  DEVELOPER: 'developer' as TeamRole,
  DESIGNER: 'designer' as TeamRole,
  VIEWER: 'viewer' as TeamRole,
};

export const canManageOrganization = (role?: OrganizationRole): boolean => {
  return role === 'owner' || role === 'admin';
};

export const canManageTeam = (
  orgRole?: OrganizationRole,
  teamRole?: TeamRole
): boolean => {
  if (orgRole === 'owner' || orgRole === 'admin') return true;
  return teamRole === 'team_lead';
};

export const canCreateTask = (teamRole?: TeamRole): boolean => {
  return teamRole !== 'viewer';
};

export const canReviewTask = (
  teamRole?: TeamRole,
  taskAssigneeId?: string,
  currentUserId?: string
): boolean => {
  // Developer cannot approve their own task
  if (taskAssigneeId && currentUserId && taskAssigneeId === currentUserId) {
    return false;
  }
  return teamRole === 'team_lead';
};

export const canMoveTaskStatus = (
  teamRole?: TeamRole,
  taskAssigneeId?: string,
  currentUserId?: string,
  targetStatus?: string
): boolean => {
  // If target is completed or changes_requested, must be team_lead and not self-reviewing
  if (targetStatus === 'completed' || targetStatus === 'changes_requested') {
    return canReviewTask(teamRole, taskAssigneeId, currentUserId);
  }
  // Developers and team leads can move to in_progress or pending_review
  if (teamRole === 'viewer') return false;
  return true;
};
