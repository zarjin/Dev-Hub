export { authApi } from '../features/auth/auth.api';
export { userApi } from '../features/users/user.api';
export { organizationApi } from '../features/organizations/organization.api';
export { teamApi } from '../features/teams/team.api';
export { taskApi } from '../features/tasks/task.api';
export { notificationApi } from '../features/notifications/notification.api';

// Re-export comment operations directly as commentApi for Section 18 requirement
import { taskApi } from '../features/tasks/task.api';
import { CreateCommentDto } from '../features/tasks/task.types';

export const commentApi = {
  getByTaskId: (taskId: string) => taskApi.getComments(taskId),
  create: (dto: CreateCommentDto, userId: string) => taskApi.addComment(dto, userId),
};
