import React from 'react';
import { Avatar } from '../ui/Avatar';
import { User } from '../../features/users/user.types';
import { cn } from '../../lib/utils';

interface UserAvatarProps {
  user?: User | null;
  name?: string;
  avatar?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showName?: boolean;
  subtitle?: string;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  name,
  avatar,
  size = 'sm',
  showName = false,
  subtitle,
  className,
}) => {
  const displayName = user?.name || name || 'Anonymous';
  const displayAvatar = user?.avatar || avatar;
  const displayUsername = user?.username ? `@${user.username}` : '';

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <Avatar src={displayAvatar} name={displayName} size={size} />
      {showName && (
        <div className="flex flex-col text-left min-w-0">
          <span className="text-xs font-semibold text-slate-200 truncate">{displayName}</span>
          {(subtitle || displayUsername) && (
            <span className="text-[11px] text-slate-400 truncate">
              {subtitle || displayUsername}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
