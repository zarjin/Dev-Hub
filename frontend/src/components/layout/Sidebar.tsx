import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setCurrentOrganization } from '../../features/organizations/organizationSlice';
import { setCurrentTeam } from '../../features/teams/teamSlice';
import { UserAvatar } from '../common/UserAvatar';
import {
  LayoutDashboard,
  CheckSquare,
  Users2,
  Building2,
  Bell,
  Settings,
  Plus,
  ChevronDown,
  Layers,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { logoutUser } from '../../features/auth/authSlice';
import { cn } from '../../lib/utils';

export interface SidebarProps {
  onCloseMobile?: () => void;
  onOpenCreateTask?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onCloseMobile,
  onOpenCreateTask,
  className,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { organizations, currentOrganization } = useAppSelector(
    (state) => state.organization
  );
  const { teams, currentTeam } = useAppSelector((state) => state.team);
  const { unreadCount } = useAppSelector((state) => state.notification);

  const [orgDropdownOpen, setOrgDropdownOpen] = React.useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = React.useState(false);

  const orgTeams = teams.filter(
    (t) => !currentOrganization || t.organizationId === currentOrganization._id
  );

  const handleOrgChange = (org: typeof organizations[0]) => {
    dispatch(setCurrentOrganization(org));
    setOrgDropdownOpen(false);
    // Auto pick first team of selected org
    const firstTeam = teams.find((t) => t.organizationId === org._id);
    if (firstTeam) {
      dispatch(setCurrentTeam(firstTeam));
    }
  };

  const handleTeamChange = (team: typeof teams[0]) => {
    dispatch(setCurrentTeam(team));
    setTeamDropdownOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      to: currentTeam ? `/teams/${currentTeam._id}/tasks` : '/dashboard',
      label: 'Tasks',
      icon: CheckSquare,
    },
    {
      to: currentOrganization ? `/organizations/${currentOrganization._id}/teams` : '/dashboard',
      label: 'Teams',
      icon: Users2,
    },
    { to: '/organizations', label: 'Organizations', icon: Building2 },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={cn(
        'w-64 flex flex-col bg-surface-darkest border-r border-surface-border h-screen select-none z-30 transition-all',
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-surface-border/60 flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-devhub-600 to-indigo-500 flex items-center justify-center shadow-glow text-white">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              DevHub
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-devhub-500/20 text-devhub-400 border border-devhub-500/30">
                PRO
              </span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Engineering SaaS</p>
          </div>
        </NavLink>
      </div>

      {/* Organization & Team Selectors */}
      <div className="p-3 space-y-2 border-b border-surface-border/60 bg-surface-background/40">
        {/* Org Selector */}
        <div className="relative">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block px-1 mb-1">
            Organization
          </label>
          <button
            type="button"
            onClick={() => {
              setOrgDropdownOpen(!orgDropdownOpen);
              setTeamDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-surface-card border border-surface-border hover:border-slate-600 transition-colors text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-md bg-devhub-600/30 border border-devhub-500/30 flex items-center justify-center text-xs font-bold text-devhub-400 flex-shrink-0">
                {currentOrganization?.name?.[0] || 'O'}
              </div>
              <span className="text-xs font-semibold text-slate-200 truncate">
                {currentOrganization?.name || 'Select Org'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          </button>

          {/* Org Dropdown Menu */}
          {orgDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-card border border-surface-borderLight rounded-xl shadow-2xl p-1 z-50 animate-slide-up">
              {organizations.map((org) => (
                <button
                  key={org._id}
                  type="button"
                  onClick={() => handleOrgChange(org)}
                  className={cn(
                    'w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left transition-colors',
                    currentOrganization?._id === org._id
                      ? 'bg-devhub-500/15 text-devhub-300'
                      : 'text-slate-300 hover:bg-surface-hover'
                  )}
                >
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{org.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Team Selector */}
        <div className="relative">
          <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block px-1 mb-1">
            Active Team
          </label>
          <button
            type="button"
            onClick={() => {
              setTeamDropdownOpen(!teamDropdownOpen);
              setOrgDropdownOpen(false);
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-surface-card border border-surface-border hover:border-slate-600 transition-colors text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-xs font-semibold text-slate-200 truncate">
                {currentTeam?.name || 'Select Team'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
          </button>

          {/* Team Dropdown Menu */}
          {teamDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-surface-card border border-surface-borderLight rounded-xl shadow-2xl p-1 z-50 animate-slide-up">
              {orgTeams.map((t) => (
                <button
                  key={t._id}
                  type="button"
                  onClick={() => handleTeamChange(t)}
                  className={cn(
                    'w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-left transition-colors',
                    currentTeam?._id === t._id
                      ? 'bg-devhub-500/15 text-devhub-300'
                      : 'text-slate-300 hover:bg-surface-hover'
                  )}
                >
                  <Users2 className="h-3.5 w-3.5 text-slate-400" />
                  <span className="truncate">{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action button */}
      <div className="p-3">
        <button
          type="button"
          onClick={onOpenCreateTask}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-devhub-500 to-indigo-600 hover:from-devhub-600 hover:to-indigo-700 text-white font-medium text-xs shadow-md shadow-devhub-500/20 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-devhub-500/15 text-devhub-300 font-semibold border border-devhub-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-hover/70'
                )
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </div>
              {link.badge !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pro Badge & Support Banner */}
      <div className="px-3 py-2">
        <div className="p-3 rounded-xl bg-gradient-to-b from-surface-elevated to-surface-card border border-surface-border text-xs">
          <div className="flex items-center gap-1.5 text-devhub-400 font-semibold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workflow Engine</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Team lead approval gating enabled. Developers cannot self-approve.
          </p>
        </div>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-surface-border/60 bg-surface-darkest flex items-center justify-between">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2 min-w-0 flex-1 hover:opacity-80 transition-opacity"
        >
          <UserAvatar user={user} showName={true} size="sm" />
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          title="Sign out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
};
