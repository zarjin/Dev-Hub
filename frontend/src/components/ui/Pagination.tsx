import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn('flex items-center justify-between gap-2 select-none py-2', className)}>
      <div className="text-xs text-slate-400">
        Page <span className="font-semibold text-slate-200">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-200">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={cn(
              'h-7 w-7 text-xs font-medium rounded-lg transition-colors',
              p === currentPage
                ? 'bg-devhub-500 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:bg-surface-hover hover:text-white border border-transparent'
            )}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-surface-border text-slate-400 hover:text-slate-200 hover:bg-surface-hover disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
