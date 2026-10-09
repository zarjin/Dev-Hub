import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchTasks,
  setFilterPriority,
  setSearchQuery,
} from '../../features/tasks/taskSlice';
import { fetchTeamById } from '../../features/teams/teamSlice';
import { TaskColumn } from '../../components/shared/TaskColumn';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { CreateTaskModal } from '../../features/tasks/components/CreateTaskModal';
import { Task, TaskStatus } from '../../features/tasks/task.types';
import {
  Plus,
  LayoutGrid,
  List,
  Filter,
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const TeamTasksPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { tasks, searchQuery, filterPriority } = useAppSelector((state) => state.task);
  const { currentTeam } = useAppSelector((state) => state.team);

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamById(teamId));
      dispatch(fetchTasks({ teamId }));
    }
  }, [dispatch, teamId]);

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    if (task.teamId !== teamId) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchAssignee = task.assignee?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee) return false;
    }
    return true;
  });

  const columns: { status: TaskStatus; title: string; accent: string }[] = [
    { status: 'todo', title: 'To Do', accent: 'border-slate-500 bg-slate-500/20' },
    { status: 'in_progress', title: 'In Progress', accent: 'border-blue-500 bg-blue-500/20' },
    { status: 'pending_review', title: 'Pending Review', accent: 'border-amber-500 bg-amber-500/20' },
    { status: 'changes_requested', title: 'Changes Requested', accent: 'border-rose-500 bg-rose-500/20' },
    { status: 'completed', title: 'Completed', accent: 'border-emerald-500 bg-emerald-500/20' },
  ];

  const handleOpenAddTask = (_status: TaskStatus) => {
    setCreateModalOpen(true);
  };

  // Table columns definition for list view
  const tableColumns = [
    {
      key: 'title',
      header: 'Task',
      render: (task: Task) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-100 hover:text-devhub-400 transition-colors">
            {task.title}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">#{task._id}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (task: Task) => <StatusBadge status={task.status} size="sm" />,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (task: Task) => <PriorityBadge priority={task.priority} size="sm" />,
    },
    {
      key: 'assignedTo',
      header: 'Assignee',
      render: (task: Task) => (
        <div className="flex items-center gap-2">
          <Avatar src={task.assignee?.avatar} name={task.assignee?.name} size="xs" />
          <span className="text-xs text-slate-200">{task.assignee?.name || 'Unassigned'}</span>
        </div>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (task: Task) => (
        <span className="text-xs text-slate-400 font-mono">
          {task.dueDate ? formatDate(task.dueDate) : '—'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-5 flex flex-col h-[calc(100vh-6rem)]">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {currentTeam?.name || 'Team'} Tasks
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-elevated text-slate-400 border border-surface-borderLight">
              {filteredTasks.length} tasks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage sprints, developer tasks, and review workflows
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center p-1 bg-surface-elevated rounded-xl border border-surface-border">
            <button
              type="button"
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'board'
                  ? 'bg-devhub-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Board View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-devhub-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => handleOpenAddTask('todo')}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-card p-3 rounded-xl border border-surface-border flex-shrink-0">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search by title, description or assignee..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            onClear={() => dispatch(setSearchQuery(''))}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span>Priority:</span>
          </div>
          <select
            value={filterPriority}
            onChange={(e) => dispatch(setFilterPriority(e.target.value))}
            className="bg-surface-elevated border border-surface-borderLight rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-devhub-500"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Main Board vs List Container */}
      {viewMode === 'board' ? (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex gap-4 h-full min-w-max">
            {columns.map((col) => (
              <TaskColumn
                key={col.status}
                status={col.status}
                title={col.title}
                accentColor={col.accent}
                tasks={filteredTasks.filter((t) => t.status === col.status)}
                onAddTask={handleOpenAddTask}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <DataTable<Task>
            columns={tableColumns}
            data={filteredTasks}
            onRowClick={(task) => navigate(`/tasks/${task._id}`)}
          />
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        defaultTeamId={teamId}
      />
    </div>
  );
};
