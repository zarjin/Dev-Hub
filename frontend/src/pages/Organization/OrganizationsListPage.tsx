import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  setCurrentOrganization,
  createNewOrganization,
} from '../../features/organizations/organizationSlice';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Plus, Users2, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSchema, OrganizationFormData } from '../../schemas/organization.schema';

export const OrganizationsListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { organizations, currentOrganization } = useAppSelector(
    (state) => state.organization
  );
  const { teams } = useAppSelector((state) => state.team);
  const { user } = useAppSelector((state) => state.auth);

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: '',
      description: '',
      logo: '',
    },
  });

  const onSubmitCreate = async (data: OrganizationFormData) => {
    if (!user) return;
    try {
      await dispatch(
        createNewOrganization({
          dto: {
            name: data.name,
            description: data.description,
            logo: data.logo,
          },
          ownerId: user._id,
        })
      ).unwrap();
      reset();
      setCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectOrg = (org: typeof organizations[0]) => {
    dispatch(setCurrentOrganization(org));
    navigate(`/organizations/${org._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Organizations</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your engineering organizations, teams, and member scopes
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          leftIcon={<Plus className="h-4 w-4" />}
          size="sm"
        >
          New Organization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {organizations.map((org) => {
          const isSelected = currentOrganization?._id === org._id;
          const orgTeams = teams.filter((t) => t.organizationId === org._id);

          return (
            <Card
              key={org._id}
              className={`p-5 transition-all duration-200 hover:border-slate-500 cursor-pointer ${
                isSelected ? 'border-devhub-500/80 bg-devhub-950/15' : ''
              }`}
              onClick={() => handleSelectOrg(org)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-devhub-600/20 border border-devhub-500/30 flex items-center justify-center font-bold text-devhub-400 text-sm overflow-hidden">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} className="h-full w-full object-cover" />
                    ) : (
                      org.name[0]
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      {org.name}
                      {isSelected && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-devhub-500/20 text-devhub-300 font-semibold border border-devhub-500/30">
                          Active
                        </span>
                      )}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">/{org.slug}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {org.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Users2 className="h-3.5 w-3.5 text-slate-400" />
                  {orgTeams.length} Teams
                </span>

                <span className="text-devhub-400 font-medium inline-flex items-center gap-1 hover:underline text-xs">
                  View Org <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Org Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Organization"
        description="Launch a new engineering organization in DevHub."
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <Input
            label="Organization Name"
            placeholder="e.g. Acme Corp"
            error={errors.name?.message}
            {...register('name')}
          />

          <Textarea
            label="Description"
            placeholder="Company mission and engineering goals..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <Input
            label="Logo URL (Optional)"
            placeholder="https://example.com/logo.png"
            error={errors.logo?.message}
            {...register('logo')}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCreateModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Organization
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
