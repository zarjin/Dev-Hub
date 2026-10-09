import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, placeholder = 'Search...', ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-devhub-500 focus:border-devhub-500',
            className
          )}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-0.5 rounded text-slate-400 hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
