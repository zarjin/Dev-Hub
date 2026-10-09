import React from 'react';
import { cn } from '../../lib/utils';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the data. Please check your network or try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-rose-500/30 bg-rose-500/5 my-4',
        className
      )}
    >
      <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 mb-3">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
      <p className="text-xs text-rose-300/80 mt-1 max-w-sm leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            onClick={onRetry}
            className="border-rose-500/30 hover:border-rose-500 text-rose-300"
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};
