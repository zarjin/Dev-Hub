import React from 'react';
import { Badge } from '../ui/Badge';
import { TaskPriority } from '../../features/tasks/task.types';
import { ArrowDown, ArrowRight, ArrowUp, AlertCircle } from 'lucide-react';

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: 'sm' | 'md';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'sm', className }) => {
  switch (priority) {
    case 'low':
      return (
        <Badge variant="neutral" size={size} className={className}>
          <ArrowDown className="h-3 w-3 mr-1 text-slate-400" />
          Low
        </Badge>
      );
    case 'medium':
      return (
        <Badge variant="primary" size={size} className={className}>
          <ArrowRight className="h-3 w-3 mr-1 text-cyan-400" />
          Medium
        </Badge>
      );
    case 'high':
      return (
        <Badge variant="warning" size={size} className={className}>
          <ArrowUp className="h-3 w-3 mr-1 text-amber-400" />
          High
        </Badge>
      );
    case 'urgent':
      return (
        <Badge variant="danger" size={size} className={className}>
          <AlertCircle className="h-3 w-3 mr-1 text-rose-400 animate-pulse" />
          Urgent
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          {priority}
        </Badge>
      );
  }
};
