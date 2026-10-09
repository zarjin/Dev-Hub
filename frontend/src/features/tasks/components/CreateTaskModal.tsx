import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '../../../schemas/task.schema';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { createNewTask } from '../taskSlice';

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTeamId?: string;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  defaultTeamId,
}) => {
  const dispatch = useAppDispatch();
  const { currentOrganization } = useAppSelector((state) => state.organization);
  const { teams, currentTeam } = useAppSelector((state) => state.team);
  const { users } = useAppSelector((state) => state.user);
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const activeOrgId = currentOrganization?._id || 'org-zarjin-tech';
  const activeTeamId = defaultTeamId || currentTeam?._id || teams[0]?._id || 'team-frontend';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      organizationId: activeOrgId,
      teamId: activeTeamId,
      assignedTo: users[0]?._id || 'user-karim',
      priority: 'medium',
      dueDate: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    if (!currentUser) return;
    try {
      await dispatch(
        createNewTask({
          dto: {
            title: data.title,
            description: data.description,
            organizationId: data.organizationId,
            teamId: data.teamId,
            assignedTo: data.assignedTo,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
          },
          createdBy: currentUser._id,
        })
      ).unwrap();
      reset();
      onClose();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a new engineering task to the team board."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Hidden Org Field */}
        <input type="hidden" {...register('organizationId')} value={activeOrgId} />

        <Input
          label="Task Title"
          placeholder="e.g. Implement WebSockets live task presence"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Description"
          placeholder="Detailed acceptance criteria and technical implementation notes..."
          rows={3}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assign Team"
            error={errors.teamId?.message}
            {...register('teamId')}
            options={teams.map((t) => ({ value: t._id, label: t.name }))}
          />

          <Select
            label="Assignee"
            error={errors.assignedTo?.message}
            {...register('assignedTo')}
            options={users.map((u) => ({ value: u._id, label: `${u.name} (@${u.username})` }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Priority"
            error={errors.priority?.message}
            {...register('priority')}
            options={[
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />

          <Input
            type="date"
            label="Due Date"
            error={errors.dueDate?.message}
            {...register('dueDate')}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};
