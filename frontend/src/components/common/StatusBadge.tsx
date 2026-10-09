import React from 'react';
import { Badge } from '../ui/Badge';
import { TaskStatus } from '../../features/tasks/task.types';
import { Circle, Clock, CheckCircle2, AlertOctagon, RotateCw } from 'lucide-react';

interface StatusBadgeProps {
  status: TaskStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm', className }) => {
  switch (status) {
    case 'todo':
      return (
        <Badge variant="neutral" size={size} className={className}>
          <Circle className="h-3 w-3 stroke-[2] mr-1 text-slate-400" />
          To Do
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge variant="primary" size={size} className={className}>
          <RotateCw className="h-3 w-3 animate-spin stroke-[2] mr-1 text-devhub-400" />
          In Progress
        </Badge>
      );
    case 'pending_review':
      return (
        <Badge variant="warning" size={size} className={className}>
          <Clock className="h-3 w-3 stroke-[2] mr-1 text-amber-400" />
          Pending Review
        </Badge>
      );
    case 'changes_requested':
      return (
        <Badge variant="danger" size={size} className={className}>
          <AlertOctagon className="h-3 w-3 stroke-[2] mr-1 text-rose-400" />
          Changes Requested
        </Badge>
      );
    case 'completed':
      return (
        <Badge variant="success" size={size} className={className}>
          <CheckCircle2 className="h-3 w-3 stroke-[2] mr-1 text-emerald-400" />
          Completed
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          {status}
        </Badge>
      );
  }
};
