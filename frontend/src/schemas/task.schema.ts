import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  assignedTo: z.string().min(1, 'Please select an assignee'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string().nullable().optional(),
  organizationId: z.string().min(1, 'Organization is required'),
  teamId: z.string().min(1, 'Team is required'),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export const commentSchema = z.object({
  text: z.string().min(1, 'Comment text cannot be empty').max(2000),
  parentId: z.string().nullable().optional(),
});

export type CommentFormData = z.infer<typeof commentSchema>;

export const reviewTaskSchema = z.object({
  action: z.enum(['approve', 'request_changes']),
  feedback: z.string().max(1000).optional(),
});

export type ReviewTaskFormData = z.infer<typeof reviewTaskSchema>;
