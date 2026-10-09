import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchOrganizationById,
  fetchOrgMembers,
  inviteOrgMember,
  updateOrgDetails,
} from '../../features/organizations/organizationSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/common/RoleBadge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Tabs } from '../../components/ui/Tabs';
import {
  Building2,
  Users2,
  Settings,
  UserPlus,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  inviteMemberSchema,
  InviteMemberFormData,
  organizationSchema,
  OrganizationFormData,
} from '../../schemas/organization.schema';
import { formatDate } from '../../lib/utils';
import { OrganizationRole } from '../../features/organizations/organization.types';

export const OrganizationDetailsPage: React.FC = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentOrganization, members } = useAppSelector(
    (state) => state.organization
  );
  const { teams } = useAppSelector((state) => state.team);
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'members' | 'teams' | 'settings'>('members');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    if (organizationId) {
      dispatch(fetchOrganizationById(organizationId));
      dispatch(fetchOrgMembers(organizationId));
    }
  }, [dispatch, organizationId]);

  const orgTeams = teams.filter((t) => t.organizationId === organizationId);

  // Invite member form
  const {
    register: registerInvite,
    handleSubmit: handleInviteSubmit,
    reset: resetInvite,
    formState: { errors: inviteErrors, isSubmitting: isInviting },
  } = useForm<InviteMemberFormData>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: '',
      role: 'member',
    },
  });

  const onInviteMember = async (data: InviteMemberFormData) => {
    if (!organizationId) return;
    try {
      await dispatch(
        inviteOrgMember({
          orgId: organizationId,
          dto: {
            email: data.email,
            role: data.role as OrganizationRole,
          },
        })
      ).unwrap();
      resetInvite();
      setInviteModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit settings form
  const {
    register: registerSettings,
    handleSubmit: handleSettingsSubmit,
    formState: { errors: settingsErrors, isSubmitting: isSavingSettings },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    values: {
      name: currentOrganization?.name || '',
      description: currentOrganization?.description || '',
      logo: currentOrganization?.logo || '',
    },
  });

  const onSaveSettings = async (data: OrganizationFormData) => {
    if (!organizationId) return;
    try {
      await dispatch(
        updateOrgDetails({
          id: organizationId,
          dto: data,
        })
      ).unwrap();
    } catch (err) {
      console.error(err);
    }
  };

  // Current user's role in this organization
  const currentMember = members.find((m) => m.userId === user?._id);
  const myRole = currentMember?.role || 'member';

  return (
    <div className="space-y-6">
      {/* Organization Header Banner */}
      <div className="p-6 rounded-2xl bg-surface-card border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-devhub-600/20 border border-devhub-500/30 flex items-center justify-center font-bold text-devhub-400 text-xl overflow-hidden flex-shrink-0">
            {currentOrganization?.logo ? (
              <img
                src={currentOrganization.logo}
                alt={currentOrganization.name}
                className="h-full w-full object-cover"
              />
            ) : (
              currentOrganization?.name?.[0] || 'O'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {currentOrganization?.name}
              </h1>
              <RoleBadge role={myRole} size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
              {currentOrganization?.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400 font-mono">
              <span>Slug: /{currentOrganization?.slug}</span>
              <span>•</span>
              <span>Created: {formatDate(currentOrganization?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setInviteModalOpen(true)}
            leftIcon={<UserPlus className="h-3.5 w-3.5" />}
          >
            Invite Member
          </Button>
          <Link to={`/organizations/${organizationId}/teams`}>
            <Button size="sm" variant="secondary" rightIcon={<ArrowRight className="h-3.5 w-3.5" />}>
              Manage Teams
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as typeof activeTab)}
        tabs={[
          { id: 'members', label: `Members (${members.length})`, icon: <Users2 className="h-4 w-4" /> },
          { id: 'teams', label: `Teams (${orgTeams.length})`, icon: <Building2 className="h-4 w-4" /> },
          { id: 'settings', label: 'Organization Settings', icon: <Settings className="h-4 w-4" /> },
        ]}
      />

      {/* Tab Panels */}
      {activeTab === 'members' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <div>
                <CardTitle>Organization Members</CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  Users who have access to this organization and its teams
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setInviteModalOpen(true)}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Add Member
              </Button>
            </div>
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
                        {member.user?.name || 'Unknown User'}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {member.user?.email || 'user@example.com'}
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

      {activeTab === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orgTeams.map((team) => (
            <Card
              key={team._id}
              className="p-5 hover:border-slate-500 transition-colors cursor-pointer"
              onClick={() => navigate(`/teams/${team._id}`)}
            >
              <h3 className="text-sm font-bold text-white mb-1">{team.name}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                {team.description}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-surface-border text-xs text-slate-400 font-mono">
                <span>Slug: /{team.slug}</span>
                <span className="text-devhub-400 font-semibold flex items-center gap-1">
                  Team View &rarr;
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'settings' && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Organization Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSettingsSubmit(onSaveSettings)} className="space-y-4">
              <Input
                label="Organization Name"
                error={settingsErrors.name?.message}
                {...registerSettings('name')}
              />

              <Textarea
                label="Organization Description"
                rows={3}
                error={settingsErrors.description?.message}
                {...registerSettings('description')}
              />

              <Input
                label="Logo Image URL"
                error={settingsErrors.logo?.message}
                {...registerSettings('logo')}
              />

              <div className="flex justify-end pt-3 border-t border-surface-border">
                <Button type="submit" isLoading={isSavingSettings}>
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Member"
        description="Add a developer or administrator to your organization."
      >
        <form onSubmit={handleInviteSubmit(onInviteMember)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="developer@company.com"
            error={inviteErrors.email?.message}
            {...registerInvite('email')}
          />

          <Select
            label="Organization Role"
            error={inviteErrors.role?.message}
            {...registerInvite('role')}
            options={[
              { value: 'member', label: 'Member - Standard team access' },
              { value: 'admin', label: 'Admin - Can manage teams and members' },
              { value: 'owner', label: 'Owner - Full organization control' },
            ]}
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setInviteModalOpen(false)}
              disabled={isInviting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isInviting}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
