import { z } from 'zod';

export const teamSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters').max(50),
  description: z.string().min(5, 'Description must be at least 5 characters').max(200),
  organizationId: z.string().min(1, 'Organization is required'),
});

export type TeamFormData = z.infer<typeof teamSchema>;

export const addTeamMemberSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  role: z.enum(['team_lead', 'developer', 'designer', 'viewer']),
});

export type AddTeamMemberFormData = z.infer<typeof addTeamMemberSchema>;
