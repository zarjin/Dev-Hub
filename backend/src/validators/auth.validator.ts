import { z } from "zod";

export const registerSchema = z.object({
  name: z.string(),
  username: z.string().lowercase().min(3).max(16),
  email: z.string().email().lowercase(),
  password: z.string().min(8).max(16),
});

export const loginSchema = z.object({
  email: z.string().email().lowercase(),
  password: z.string().min(8).max(16),
});
