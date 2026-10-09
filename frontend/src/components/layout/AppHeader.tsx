import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { markNotificationAsRead } from '../../features/notifications/notificationSlice';
import { SearchInput } from '../ui/SearchInput';
import { Avatar } from '../ui/Avatar';
import { Breadcrumbs, BreadcrumbItem } from '../common/Breadcrumbs';
import {
  Bell,
  Menu,
  Plus,
} from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { Button } from '../ui/Button';

export interface AppHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onOpenMobileMenu?: () => void;
  onOpenCreateTask?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  breadcrumbs = [{ label: 'Dashboard' }],
  onOpenMobileMenu,
  onOpenCreateTask,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { notifications, unreadCount } = useAppSelector((state) => state.notification);
  const [searchValue, setSearchValue] = useState('');
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    dispatch(markNotificationAsRead(notif._id));
    setNotifDropdownOpen(false);
    if (notif.taskId) {
      navigate(`/tasks/${notif.taskId}`);
    } else if (notif.teamId) {
      navigate(`/teams/${notif.teamId}`);
    }
  };

  return (
    <header className="h-16 border-b border-surface-border bg-surface-background/80 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Breadcrumbs items={breadcrumbs} />
      </div>

      {/* Center/Right: Search & Action Controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:block w-48 md:w-64">
          <SearchInput
            placeholder="Search tasks, teams..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
          />
        </div>

        {/* Quick New Task on header for desktop */}
        {onOpenCreateTask && (
          <Button
            size="sm"
            onClick={onOpenCreateTask}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            className="hidden lg:inline-flex"
          >
            Create Task
          </Button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-surface-hover border border-surface-border transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold font-mono flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-card border border-surface-borderLight rounded-2xl shadow-2xl p-2 z-50 animate-slide-up">
              <div className="flex items-center justify-between p-2 border-b border-surface-border">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Notifications ({unreadCount} new)
                </span>
                <Link
                  to="/notifications"
                  onClick={() => setNotifDropdownOpen(false)}
                  className="text-[11px] text-devhub-400 hover:text-devhub-300 font-semibold"
                >
                  View all
                </Link>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-surface-border/50 py-1">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-2.5 rounded-lg text-left cursor-pointer transition-colors flex items-start gap-2.5 ${
                      !n.isRead ? 'bg-devhub-500/10' : 'hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatRelativeTime(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    {!n.isRead && (
                      <div className="h-2 w-2 rounded-full bg-devhub-500 mt-1 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <Link to="/profile" className="flex items-center gap-2 pl-1">
          <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
        </Link>
      </div>
    </header>
  );
};
