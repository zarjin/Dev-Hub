import React, { useState } from 'react';
import { cn, getInitials } from '../../lib/utils';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  status,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
    xl: 'h-14 w-14 text-base font-semibold',
  };

  const statusSizes = {
    xs: 'h-1.5 w-1.5 border-[1px]',
    sm: 'h-2 w-2 border-[1.5px]',
    md: 'h-2.5 w-2.5 border-2',
    lg: 'h-3 w-3 border-2',
    xl: 'h-3.5 w-3.5 border-2',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    busy: 'bg-amber-500',
    offline: 'bg-slate-500',
  };

  const showImage = src && !imageError;

  return (
    <div className="relative inline-block select-none">
      <div
        className={cn(
          'rounded-full overflow-hidden flex items-center justify-center font-medium bg-gradient-to-tr from-devhub-700 to-indigo-500 text-white border border-surface-borderLight',
          sizes[size],
          className
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={name}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-surface-background',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};
