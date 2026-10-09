import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { createNewTeam } from '../../features/teams/teamSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Users2, Plus, ArrowRight, CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teamSchema, TeamFormData } from '../../schemas/team.schema';

export const OrganizationTeamsPage: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { teams } = useAppSelector((state) => state.team);
  const { currentOrganization } = useAppSelector((state) => state.organization);
  const { tasks } = useAppSelector((state) => state.task);
  const { user } = useAppSelector((state) => state.auth);

  const [createTeamModalOpen, setCreateTeamModalOpen] = useState(false);

  const orgTeams = teams.filter(
    (t) => !organizationId || t.organizationId === organizationId
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      organizationId: organizationId || 'org-zarjin-tech',
    },
  });

  const onSubmitCreateTeam = async (data: TeamFormData) => {
    if (!user) return;
    try {
      await dispatch(
        createNewTeam({
          dto: data,
          createdBy: user._id,
        })
      ).unwrap();
      reset();
      setCreateTeamModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Teams in {currentOrganization?.name || 'Organization'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Engineering squads responsible for development, features, and code quality
          </p>
        </div>

        <Button
          onClick={() => setCreateTeamModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          size="sm"
        >
          Create New Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {orgTeams.map((team) => {
          const teamTasks = tasks.filter((t) => t.teamId === team._id);
          const completedCount = teamTasks.filter((t) => t.status === 'completed').length;

          return (
            <Card
              key={team._id}
              className="p-5 hover:border-slate-500 transition-all duration-200 cursor-pointer hover:-translate-y-0.5"
              onClick={() => navigate(`/teams/${team._id}`)}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-devhub-500/10 text-devhub-400 border border-devhub-500/20">
                    <Users2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{team.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400">/{team.slug}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 my-3 leading-relaxed">
                {team.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="h-3 w-3 text-devhub-400" />
                    {teamTasks.length} Tasks
                  </span>
                  <span className="text-emerald-400 text-[11px]">
                    {completedCount} Done
                  </span>
                </div>

                <span className="text-devhub-400 font-semibold flex items-center gap-1 hover:underline">
                  Board <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Team Modal */}
      <Modal
        isOpen={createTeamModalOpen}
        onClose={() => setCreateTeamModalOpen(false)}
        title="Create Engineering Team"
        description="Set up a new squad for tasks, sprints, and code reviews."
      >
        <form onSubmit={handleSubmit(onSubmitCreateTeam)} className="space-y-4">
          <input type="hidden" {...register('organizationId')} value={organizationId} />

          <Input
            label="Team Name"
            placeholder="e.g. Infrastructure & DevOps"
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Description"
            placeholder="Squad objectives, domain boundaries, and responsibilities..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateTeamModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
