import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className,
}) => {
  const variants = {
    primary: 'bg-devhub-500/15 text-devhub-300 border-devhub-500/30',
    success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    neutral: 'bg-surface-elevated text-slate-300 border-surface-borderLight',
    outline: 'bg-transparent text-slate-400 border-surface-border',
    purple: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };

  const dotColors = {
    primary: 'bg-devhub-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    neutral: 'bg-slate-400',
    outline: 'bg-slate-400',
    purple: 'bg-purple-400',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border select-none tracking-wide uppercase font-mono',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
      {children}
    </span>
  );
};
