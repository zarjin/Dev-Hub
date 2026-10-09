import { z } from 'zod';

export const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(50),
  description: z.string().min(5, 'Description must be at least 5 characters').max(200),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export type OrganizationFormData = z.infer<typeof organizationSchema>;

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['owner', 'admin', 'member']),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
