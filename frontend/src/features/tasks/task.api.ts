import apiClient from '../../services/axios';
import {
  Task,
  TaskActivity,
  Comment,
  CreateTaskDto,
  UpdateTaskDto,
  CreateCommentDto,
  ReviewTaskDto,
} from './task.types';
import { mockStorage } from '../../services/mockStorage';

export const taskApi = {
  getTasks: async (teamId?: string, organizationId?: string): Promise<Task[]> => {
    try {
      const response = await apiClient.get<Task[]>('/tasks', {
        params: { teamId, organizationId },
      });
      return response.data;
    } catch {
      return mockStorage.getTasks(teamId, organizationId);
    }
  },

  getTaskById: async (id: string): Promise<Task> => {
    try {
      const response = await apiClient.get<Task>(`/tasks/${id}`);
      return response.data;
    } catch {
      const task = mockStorage.getTaskById(id);
      if (!task) throw new Error('Task not found');
      return task;
    }
  },

  createTask: async (dto: CreateTaskDto, createdBy: string): Promise<Task> => {
    try {
      const response = await apiClient.post<Task>('/tasks', dto);
      return response.data;
    } catch {
      return mockStorage.createTask({
        organizationId: dto.organizationId,
        teamId: dto.teamId,
        title: dto.title,
        description: dto.description,
        assignedTo: dto.assignedTo,
        createdBy,
        status: 'todo',
        priority: dto.priority,
        dueDate: dto.dueDate || null,
      });
    }
  },

  updateTask: async (
    id: string,
    dto: UpdateTaskDto,
    actorId: string
  ): Promise<Task> => {
    try {
      const response = await apiClient.patch<Task>(`/tasks/${id}`, dto);
      return response.data;
    } catch {
      return mockStorage.updateTask(id, dto, actorId);
    }
  },

  reviewTask: async (
    id: string,
    review: ReviewTaskDto,
    actorId: string
  ): Promise<Task> => {
    try {
      const response = await apiClient.post<Task>(`/tasks/${id}/review`, review);
      return response.data;
    } catch {
      const targetStatus = review.action === 'approve' ? 'completed' : 'changes_requested';
      return mockStorage.updateTask(
        id,
        { status: targetStatus },
        actorId
      );
    }
  },

  getTaskActivities: async (taskId: string): Promise<TaskActivity[]> => {
    try {
      const response = await apiClient.get<TaskActivity[]>(`/tasks/${taskId}/activities`);
      return response.data;
    } catch {
      return mockStorage.getTaskActivities(taskId);
    }
  },

  getComments: async (taskId: string): Promise<Comment[]> => {
    try {
      const response = await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
      return response.data;
    } catch {
      return mockStorage.getComments(taskId);
    }
  },

  addComment: async (dto: CreateCommentDto, userId: string): Promise<Comment> => {
    try {
      const response = await apiClient.post<Comment>(`/tasks/${dto.taskId}/comments`, dto);
      return response.data;
    } catch {
      return mockStorage.addComment({
        taskId: dto.taskId,
        userId,
        text: dto.text,
        parentId: dto.parentId,
      });
    }
  },
};
