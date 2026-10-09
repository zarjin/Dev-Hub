import React from 'react';
import { TaskActivity } from '../../features/tasks/task.types';
import { Avatar } from '../ui/Avatar';
import { formatRelativeTime } from '../../lib/utils';
import {
  PlusCircle,
  UserPlus,
  PlayCircle,
  FileCheck2,
  AlertTriangle,
  MessageSquare,
  Activity as ActivityIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ActivityFeedProps {
  activities: TaskActivity[];
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, className }) => {
  const getActivityIcon = (activity: TaskActivity) => {
    if (activity.action === 'created') {
      return <PlusCircle className="h-3.5 w-3.5 text-devhub-400" />;
    }
    if (activity.action === 'assigned') {
      return <UserPlus className="h-3.5 w-3.5 text-indigo-400" />;
    }
    if (activity.action === 'commented') {
      return <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />;
    }
    if (activity.toStatus === 'in_progress') {
      return <PlayCircle className="h-3.5 w-3.5 text-blue-400" />;
    }
    if (activity.toStatus === 'pending_review') {
      return <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />;
    }
    if (activity.toStatus === 'changes_requested') {
      return <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />;
    }
    if (activity.toStatus === 'completed') {
      return <FileCheck2 className="h-3.5 w-3.5 text-emerald-400" />;
    }
    return <ActivityIcon className="h-3.5 w-3.5 text-slate-400" />;
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400">
        No recorded activity yet.
      </div>
    );
  }

  return (
    <div className={cn('relative space-y-4 before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-surface-borderLight', className)}>
      {activities.map((item) => (
        <div key={item._id} className="relative flex items-start gap-3 pl-1">
          {/* Timeline node icon */}
          <div className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated border border-surface-border text-slate-300 shadow-sm flex-shrink-0">
            {getActivityIcon(item)}
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Avatar
                  src={item.actor?.avatar}
                  name={item.actor?.name || 'User'}
                  size="xs"
                />
                <span className="text-xs text-slate-200 leading-snug">
                  {item.message}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                {formatRelativeTime(item.createdAt)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
