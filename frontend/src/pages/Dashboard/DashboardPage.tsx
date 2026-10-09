import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchTasks } from '../../features/tasks/taskSlice';
import { setCurrentOrganization } from '../../features/organizations/organizationSlice';
import { setCurrentTeam } from '../../features/teams/teamSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { TaskCard } from '../../components/shared/TaskCard';
import { ActivityFeed } from '../../components/shared/ActivityFeed';
import { CreateTaskModal } from '../../features/tasks/components/CreateTaskModal';
import {
  CheckCircle2,
  Clock,
  RotateCw,
  AlertOctagon,
  Calendar,
  Layers,
  Users2,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Inbox,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { organizations, currentOrganization } = useAppSelector((state) => state.organization);
  const { teams, currentTeam } = useAppSelector((state) => state.team);
  const { tasks, activities } = useAppSelector((state) => state.task);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my_tasks' | 'pending_reviews' | 'all'>('my_tasks');
  const [now] = useState(() => Date.now());

  useEffect(() => {
    dispatch(
      fetchTasks({
        organizationId: currentOrganization?._id,
        teamId: currentTeam?._id,
      })
    );
  }, [dispatch, currentOrganization?._id, currentTeam?._id]);

  // Statistics Calculation
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const pendingReviewTasks = tasks.filter((t) => t.status === 'pending_review');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const overdueTasks = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== 'completed' &&
      new Date(t.dueDate).getTime() < now
  );

  // My Tasks
  const myTasks = tasks.filter((t) => t.assignedTo === user?._id);

  // Filter tasks based on activeTab
  const displayedTasks =
    activeTab === 'my_tasks'
      ? myTasks
      : activeTab === 'pending_reviews'
      ? pendingReviewTasks
      : tasks;

  const upcomingDeadlines = [...tasks]
    .filter((t) => t.dueDate && t.status !== 'completed')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Context Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-surface-card via-surface-card to-surface-elevated p-6 rounded-2xl border border-surface-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-devhub-400 font-mono">
              Workspace Overview
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">
              {currentOrganization?.name || 'Zarjin Technologies'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Developer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your engineering team status, active review requests, and task deadlines.
          </p>
        </div>

        {/* Quick Selectors & Action */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Org Selector */}
          <select
            value={currentOrganization?._id || ''}
            onChange={(e) => {
              const org = organizations.find((o) => o._id === e.target.value);
              if (org) dispatch(setCurrentOrganization(org));
            }}
            className="bg-surface-elevated border border-surface-borderLight rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-devhub-500 cursor-pointer"
          >
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                Org: {org.name}
              </option>
            ))}
          </select>

          {/* Team Selector */}
          <select
            value={currentTeam?._id || ''}
            onChange={(e) => {
              const t = teams.find((item) => item._id === e.target.value);
              if (t) dispatch(setCurrentTeam(t));
            }}
            className="bg-surface-elevated border border-surface-borderLight rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-devhub-500 cursor-pointer"
          >
            <option value="">All Teams</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>
                Team: {t.name}
              </option>
            ))}
          </select>

          <Button
            size="sm"
            onClick={() => setCreateModalOpen(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Task Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Tasks */}
        <Card className="p-4 border-surface-border hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <Layers className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-white">{totalTasks}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3 text-emerald-400" /> Active
            </span>
          </div>
        </Card>

        {/* In Progress */}
        <Card className="p-4 border-surface-border hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <RotateCw className="h-4 w-4 animate-spin text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-blue-200">
              {inProgressTasks.length}
            </span>
            <span className="text-[10px] text-blue-400/80">Active sprints</span>
          </div>
        </Card>

        {/* Pending Review */}
        <Card className="p-4 border-surface-border hover:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-200">
              {pendingReviewTasks.length}
            </span>
            <span className="text-[10px] text-amber-400 font-medium">Requires Lead</span>
          </div>
        </Card>

        {/* Completed */}
        <Card className="p-4 border-surface-border hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-200">
              {completedTasks.length}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Approved</span>
          </div>
        </Card>

        {/* Overdue */}
        <Card className="p-4 border-surface-border hover:border-rose-500/40 transition-colors col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overdue</span>
            <AlertOctagon className="h-4 w-4 text-rose-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-200">
              {overdueTasks.length}
            </span>
            <span className="text-[10px] text-rose-400 font-medium">Needs Attention</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Tasks Tabbed Board vs Side Timelines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Task Feeds */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <CardTitle>Sprint Work &amp; Task Queues</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Filter tasks assigned to you or needing approval
                </p>
              </div>

              {/* Tab Pills */}
              <div className="flex items-center p-1 bg-surface-elevated rounded-xl border border-surface-border text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('my_tasks')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-colors',
                    activeTab === 'my_tasks'
                      ? 'bg-devhub-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  My Tasks ({myTasks.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('pending_reviews')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-colors',
                    activeTab === 'pending_reviews'
                      ? 'bg-devhub-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  Pending Reviews ({pendingReviewTasks.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg font-medium transition-colors',
                    activeTab === 'all'
                      ? 'bg-devhub-500 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  All ({tasks.length})
                </button>
              </div>
            </CardHeader>

            <CardContent>
              {displayedTasks.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-surface-border rounded-xl">
                  <Inbox className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-300">No tasks in this view</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Create a task or switch tabs to review team workloads.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {displayedTasks.map((task) => (
                    <TaskCard key={task._id} task={task} showStatus={true} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Shortcuts to Teams */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-4 w-4 text-devhub-400" />
                  <span>Engineering Teams</span>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/organizations')}
                  rightIcon={<ArrowUpRight className="h-3 w-3" />}
                >
                  View All Teams
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {teams.map((team) => {
                  const teamTasks = tasks.filter((t) => t.teamId === team._id);
                  return (
                    <div
                      key={team._id}
                      onClick={() => navigate(`/teams/${team._id}/tasks`)}
                      className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-border hover:border-devhub-500/50 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      <h4 className="text-xs font-bold text-slate-100 truncate">{team.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {team.description}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-surface-border/50 text-[11px] text-slate-400 font-mono">
                        <span>{teamTasks.length} Tasks</span>
                        <span className="text-devhub-400 font-medium">Board &rarr;</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): Deadlines & Realtime Activity Timeline */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <span>Upcoming Deadlines</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No pending deadlines</p>
              ) : (
                upcomingDeadlines.map((t) => {
                  const isOver =
                    t.dueDate && new Date(t.dueDate).getTime() < now;
                  return (
                    <div
                      key={t._id}
                      onClick={() => navigate(`/tasks/${t._id}`)}
                      className="p-3 rounded-xl bg-surface-elevated/50 border border-surface-border hover:border-slate-500 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {t.title}
                        </span>
                        <span
                          className={cn(
                            'text-[10px] font-mono px-1.5 py-0.5 rounded font-bold',
                            isOver
                              ? 'bg-rose-500/10 text-rose-400'
                              : 'bg-amber-500/10 text-amber-400'
                          )}
                        >
                          {new Date(t.dueDate!).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        Assignee: {t.assignee?.name || 'Unassigned'}
                      </p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed activities={activities.slice(0, 6)} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
