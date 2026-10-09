import { User } from '../users/user.types';

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'pending_review'
  | 'changes_requested'
  | 'completed';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  _id: string;
  organizationId: string;
  teamId: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // Populated fields for UI convenience
  assignee?: User;
  creator?: User;
}

export type TaskActivityAction =
  | 'created'
  | 'assigned'
  | 'status_changed'
  | 'commented'
  | 'updated'
  | 'reviewed';

export interface TaskActivity {
  _id: string;
  taskId: string;
  teamId: string;
  actorId: string;
  action: TaskActivityAction;
  fromStatus: string | null;
  toStatus: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
  actor?: User;
}

export interface Comment {
  _id: string;
  taskId: string;
  userId: string;
  text: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  user?: User;
  replies?: Comment[];
}

export interface CreateTaskDto {
  organizationId: string;
  teamId: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: TaskPriority;
  dueDate?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
}

export interface CreateCommentDto {
  taskId: string;
  text: string;
  parentId?: string | null;
}

export interface ReviewTaskDto {
  action: 'approve' | 'request_changes';
  feedback?: string;
}
