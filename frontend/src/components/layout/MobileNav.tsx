import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import {
  LayoutDashboard,
  CheckSquare,
  Users2,
  Bell,
  User,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileNav: React.FC = () => {
  const { currentTeam } = useAppSelector((state) => state.team);
  const { currentOrganization } = useAppSelector((state) => state.organization);
  const { unreadCount } = useAppSelector((state) => state.notification);

  const navItems = [
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
    {
      to: '/notifications',
      label: 'Alerts',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-darkest/95 backdrop-blur-lg border-t border-surface-border px-3 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center p-1 rounded-xl text-[10px] font-medium transition-colors relative min-w-[54px]',
                isActive
                  ? 'text-devhub-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )
            }
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 h-3.5 min-w-[14px] px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="mt-1">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
