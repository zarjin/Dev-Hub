import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    info: <Info className="h-5 w-5 text-devhub-400" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/20',
    error: 'border-rose-500/40 bg-rose-950/20',
    warning: 'border-amber-500/40 bg-amber-950/20',
    info: 'border-devhub-500/40 bg-devhub-950/20',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-surface-card max-w-sm w-full animate-slide-up',
        borders[toast.type]
      )}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-100">{toast.title}</h4>
        {toast.message && (
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-200 p-0.5 rounded"
        aria-label="Dismiss toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
