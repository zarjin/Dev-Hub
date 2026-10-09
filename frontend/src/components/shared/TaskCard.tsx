import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../features/tasks/task.types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { Avatar } from '../ui/Avatar';
import { formatDate } from '../../lib/utils';
import { Calendar, MessageSquare, CheckSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TaskCardProps {
  task: Task;
  showStatus?: boolean;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  className?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  showStatus = false,
  className,
}) => {
  const navigate = useNavigate();
  const [now] = React.useState(() => Date.now());

  const isOverdue =
    task.dueDate &&
    task.status !== 'completed' &&
    new Date(task.dueDate).getTime() < now;

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className={cn(
        'group relative bg-surface-card border border-surface-border rounded-xl p-4 transition-all duration-200',
        'hover:border-slate-600 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer',
        task.status === 'completed' && 'opacity-85',
        className
      )}
    >
      {/* Top Header: ID & Badges */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-slate-400 font-semibold group-hover:text-devhub-400 transition-colors">
            #{task._id.replace('task-', '')}
          </span>
          <PriorityBadge priority={task.priority} size="sm" />
        </div>
        {showStatus && <StatusBadge status={task.status} size="sm" />}
      </div>

      {/* Task Title */}
      <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Task Description snippet */}
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer: Due date & Assignee */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-surface-border/60 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {task.dueDate ? (
            <span
              className={cn(
                'flex items-center gap-1 font-mono text-[11px]',
                isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
              )}
            >
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-slate-400 text-[11px]">
              <CheckSquare className="h-3 w-3" />
              No deadline
            </span>
          )}

          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <MessageSquare className="h-3 w-3" />
            <span>2</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Avatar
            src={task.assignee?.avatar}
            name={task.assignee?.name || 'Assignee'}
            size="xs"
          />
        </div>
      </div>
    </div>
  );
};
