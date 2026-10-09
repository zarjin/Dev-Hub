import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../features/notifications/notificationSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  MessageSquare,
  Users2,
  Building2,
  Sparkles,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';
import { NotificationType } from '../../features/notifications/notification.types';

export const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notification
  );
  const { user } = useAppSelector((state) => state.auth);

  const handleMarkAllRead = () => {
    if (user?._id) {
      dispatch(markAllNotificationsAsRead(user._id));
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    if (!notif.isRead) {
      dispatch(markNotificationAsRead(notif._id));
    }
    if (notif.taskId) {
      navigate(`/tasks/${notif.taskId}`);
    } else if (notif.teamId) {
      navigate(`/teams/${notif.teamId}`);
    } else if (notif.organizationId) {
      navigate(`/organizations/${notif.organizationId}`);
    }
  };

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'task_assigned':
        return <Clock className="h-4 w-4 text-devhub-400" />;
      case 'task_review':
        return <Clock className="h-4 w-4 text-amber-400" />;
      case 'task_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-cyan-400" />;
      case 'team_invitation':
        return <Users2 className="h-4 w-4 text-indigo-400" />;
      case 'organization_invitation':
        return <Building2 className="h-4 w-4 text-purple-400" />;
      case 'system':
      default:
        return <Sparkles className="h-4 w-4 text-devhub-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Realtime alerts, task updates, reviews, and team invitations
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="secondary"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="h-3.5 w-3.5" />}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-devhub-400" />
              <span>All Notifications</span>
            </CardTitle>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-elevated text-slate-400">
              {unreadCount} unread
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <Inbox className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">You have no new notifications.</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border">
              {notifications.map((notif) => (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-4 transition-colors flex items-start gap-3.5 cursor-pointer ${
                    !notif.isRead
                      ? 'bg-devhub-500/10 hover:bg-devhub-500/15'
                      : 'hover:bg-surface-elevated/50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-surface-elevated border border-surface-borderLight flex-shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-2">
                        {notif.title}
                        {!notif.isRead && (
                          <span className="h-2 w-2 rounded-full bg-devhub-400 animate-pulse" />
                        )}
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>

                    {(notif.taskId || notif.teamId) && (
                      <div className="mt-2 text-[11px] text-devhub-400 hover:text-devhub-300 font-semibold inline-flex items-center gap-1">
                        <span>Go to {notif.taskId ? 'task' : 'team'}</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
