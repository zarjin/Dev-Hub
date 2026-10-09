import React from 'react';
import { Task, TaskStatus } from '../../features/tasks/task.types';
import { TaskCard } from './TaskCard';
import { Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  accentColor?: string;
  className?: string;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  status,
  title,
  tasks,
  onAddTask,
  accentColor = 'border-slate-700',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col min-w-[280px] w-full max-w-[340px] bg-surface-elevated/40 border border-surface-border rounded-2xl p-3.5 h-full max-h-[calc(100vh-14rem)]',
        className
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-surface-border/60">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full border', accentColor)} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-surface-card border border-surface-borderLight text-slate-400 font-semibold">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onAddTask && (
            <button
              type="button"
              onClick={() => onAddTask(status)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-surface-hover transition-colors"
              title="Add task to column"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-slate-100 hover:bg-surface-hover transition-colors"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-surface-border rounded-xl text-center">
            <span className="text-xs text-slate-400">No tasks here</span>
            {onAddTask && (
              <button
                type="button"
                onClick={() => onAddTask(status)}
                className="mt-2 text-xs text-devhub-400 hover:text-devhub-300 font-medium inline-flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add one
              </button>
            )}
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
};
