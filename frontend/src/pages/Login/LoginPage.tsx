import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../../schemas/auth.schema';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser, clearError } from '../../features/auth/authSlice';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [_demoRole, setDemoRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'zarjin@devhub.io',
      password: 'password123',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    dispatch(clearError());
    try {
      await dispatch(loginUser(data)).unwrap();
      navigate('/dashboard');
    } catch {
      // Error handled in slice
    }
  };

  const handleQuickDemoLogin = (email: string, roleName: string) => {
    setDemoRole(roleName);
    setValue('email', email);
    setValue('password', 'password123');
    dispatch(loginUser({ email, password: 'password123' })).then(() => {
      navigate('/dashboard');
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-white">Sign In to DevHub</h2>
        <p className="text-xs text-slate-400 mt-1">
          Access your engineering organization workspace
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {error}
        </div>
      )}

      {/* Demo Switcher Buttons */}
      <div className="p-3 rounded-xl bg-surface-elevated/70 border border-surface-borderLight space-y-2">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider text-center">
          Quick Demo Accounts
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('zarjin@devhub.io', 'Lead')}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface-hover border border-devhub-500/30 text-xs font-medium text-left transition-colors"
          >
            <span className="block font-semibold text-devhub-400">Zarjin Ahmed</span>
            <span className="text-[10px] text-slate-400">Team Lead / Owner</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('karim@devhub.io', 'Developer')}
            className="p-2 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-xs font-medium text-left transition-colors"
          >
            <span className="block font-semibold text-slate-200">Karim Rahman</span>
            <span className="text-[10px] text-slate-400">Developer</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
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

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
            <input type="checkbox" className="rounded bg-surface-card border-surface-border text-devhub-500" />
            <span>Remember me</span>
          </label>
          <a href="#forgot" className="text-devhub-400 hover:text-devhub-300">
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          leftIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      <div className="pt-4 border-t border-surface-border text-center text-xs text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-devhub-400 hover:text-devhub-300 font-semibold inline-flex items-center gap-1">
          Create one <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
};
