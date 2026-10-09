import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchTeamById,
  fetchTeamMembers,
  addTeamMember,
} from '../../features/teams/teamSlice';
import { fetchTasks } from '../../features/tasks/taskSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/common/RoleBadge';
import { Modal } from '../../components/ui/Modal';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import { TaskCard } from '../../components/shared/TaskCard';
import { ActivityFeed } from '../../components/shared/ActivityFeed';
import {
  Users2,
  CheckSquare,
  Plus,
  ArrowRight,
  Crown,
  Activity,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTeamMemberSchema, AddTeamMemberFormData } from '../../schemas/team.schema';
import { TeamRole } from '../../features/teams/team.types';
import { formatDate } from '../../lib/utils';

export const TeamDetailsPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const dispatch = useAppDispatch();

  const { currentTeam, members } = useAppSelector((state) => state.team);
  const { users } = useAppSelector((state) => state.user);
  const { tasks, activities } = useAppSelector((state) => state.task);

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activity'>('overview');
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchTeamById(teamId));
      dispatch(fetchTeamMembers(teamId));
      dispatch(fetchTasks({ teamId }));
    }
  }, [dispatch, teamId]);

  const teamLeadMember = members.find((m) => m.role === 'team_lead');
  const teamLeadUser = teamLeadMember?.user || users.find((u) => u._id === teamLeadMember?.userId);

  const teamTasks = tasks.filter((t) => t.teamId === teamId);
  const inProgress = teamTasks.filter((t) => t.status === 'in_progress').length;
  const pendingReview = teamTasks.filter((t) => t.status === 'pending_review').length;
  const completed = teamTasks.filter((t) => t.status === 'completed').length;

  // Add team member form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddTeamMemberFormData>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: {
      userId: users[0]?._id || '',
      role: 'developer',
    },
  });

  const onAddMember = async (data: AddTeamMemberFormData) => {
    if (!teamId) return;
    try {
      await dispatch(
        addTeamMember({
          teamId,
          dto: {
            userId: data.userId,
            role: data.role as TeamRole,
          },
        })
      ).unwrap();
      reset();
      setAddMemberModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Header Banner */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-devhub-400 font-semibold">
              Team Space
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">/{currentTeam?.slug}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {currentTeam?.name}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            {currentTeam?.description}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            {teamLeadUser && (
              <div className="flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-400" />
                <span>Lead:</span>
                <span className="font-semibold text-slate-200">{teamLeadUser.name}</span>
              </div>
            )}
            <span>•</span>
            <span>{members.length} Squad Members</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setAddMemberModalOpen(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            Add Member
          </Button>

          <Link to={`/teams/${teamId}/tasks`}>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<CheckSquare className="h-3.5 w-3.5" />}
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Task Board
            </Button>
          </Link>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Work</span>
          <p className="text-2xl font-bold font-mono text-white mt-1">{teamTasks.length}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-blue-400">In Progress</span>
          <p className="text-2xl font-bold font-mono text-blue-200 mt-1">{inProgress}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-amber-400">Pending Review</span>
          <p className="text-2xl font-bold font-mono text-amber-200 mt-1">{pendingReview}</p>
        </Card>
        <Card className="p-4">
          <span className="text-xs font-semibold uppercase text-emerald-400">Completed</span>
          <p className="text-2xl font-bold font-mono text-emerald-200 mt-1">{completed}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(t) => setActiveTab(t as typeof activeTab)}
        tabs={[
          { id: 'overview', label: 'Tasks Overview', icon: <CheckSquare className="h-4 w-4" /> },
          { id: 'members', label: `Members (${members.length})`, icon: <Users2 className="h-4 w-4" /> },
          { id: 'activity', label: 'Team Activity', icon: <Activity className="h-4 w-4" /> },
        ]}
      />

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200">Recent Tasks</h3>
            <Link
              to={`/teams/${teamId}/tasks`}
              className="text-xs text-devhub-400 hover:text-devhub-300 font-semibold"
            >
              Open Kanban Board &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {teamTasks.slice(0, 6).map((task) => (
              <TaskCard key={task._id} task={task} showStatus={true} />
            ))}
          </div>
        </div>
      )}

      {/* Members tab */}
      {activeTab === 'members' && (
        <Card>
          <CardHeader>
            <CardTitle>Team Member Roster</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-surface-border">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.user?.avatar}
                      name={member.user?.name || 'Member'}
                      size="md"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100">
                        {member.user?.name || 'Developer'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        @{member.user?.username || 'user'} • {member.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                      Joined {formatDate(member.joinedAt || member.createdAt)}
                    </span>
                    <RoleBadge role={member.role} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <CardTitle>Team Audit Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityFeed activities={activities} />
          </CardContent>
        </Card>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        title="Add Squad Member"
        description="Assign a developer, designer, or viewer to this engineering team."
      >
        <form onSubmit={handleSubmit(onAddMember)} className="space-y-4">
          <Select
            label="User"
            error={errors.userId?.message}
            {...register('userId')}
            options={users.map((u) => ({ value: u._id, label: `${u.name} (${u.email})` }))}
          />

          <Select
            label="Team Role"
            error={errors.role?.message}
            {...register('role')}
            options={[
              { value: 'team_lead', label: 'Team Lead (Can approve / request changes)' },
              { value: 'developer', label: 'Developer (Builds tasks, requests reviews)' },
              { value: 'designer', label: 'Designer (UI/UX specs, assets)' },
              { value: 'viewer', label: 'Viewer (Read-only access)' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAddMemberModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Add to Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
