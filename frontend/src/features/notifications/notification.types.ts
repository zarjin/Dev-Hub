export type NotificationType =
  | 'task_assigned'
  | 'task_review'
  | 'task_completed'
  | 'comment'
  | 'team_invitation'
  | 'organization_invitation'
  | 'system';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  taskId: string | null;
  teamId: string | null;
  organizationId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}
