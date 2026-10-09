import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../../schemas/auth.schema';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { registerUser, clearError } from '../../features/auth/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    dispatch(clearError());
    try {
      await dispatch(
        registerUser({
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
        })
      ).unwrap();
      navigate('/dashboard');
    } catch {
      // Error in slice
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Join DevHub</h2>
        <p className="text-xs text-slate-400 mt-1">
          Create your account to start managing teams &amp; projects
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            placeholder="Alex Rivera"
            leftIcon={<User className="h-4 w-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Username"
            placeholder="alex_dev"
            error={errors.username?.message}
            {...register('username')}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          placeholder="alex@company.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          isLoading={isLoading}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Create Account
        </Button>
      </form>

      <div className="pt-4 border-t border-surface-border text-center text-xs text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-devhub-400 hover:text-devhub-300 font-semibold inline-flex items-center gap-1">
          Sign in <ArrowLeft className="h-3 w-3 rotate-180" />
        </Link>
      </div>
    </div>
  );
};
