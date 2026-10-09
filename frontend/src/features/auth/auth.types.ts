import { User } from '../users/user.types';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface RegisterDto {
  name: string;
  username: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
