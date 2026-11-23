import React from 'react';
import { Bell, CheckCircle2, Clock, AlertTriangle, ArrowRight, Trash2, MailOpen } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { useAuth } from '../../context/AuthContext';

interface StudentNotificationsProps {
  onNavigate: (page: string, params?: any) => void;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({ onNavigate }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSystem();
  const { currentUser } = useAuth();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
        return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
      case 'status_update':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'resolution':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'high_priority':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Notification Center
            </span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">
                {unreadCount} unread
              </span>
            )}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Grievance & Dispatch Updates
          </h2>
          <p className="text-xs text-slate-500">
            Real-time notifications generated autonomously by the multi-agent coordinator and field technicians.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => markAllAsRead()}
            className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
          >
            <MailOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Bell className="w-6 h-6" />
            </div>
            <p className="font-bold text-slate-700 text-sm">All caught up!</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You will receive real-time notifications here as agents process and update your maintenance requests.
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const isUnread = !n.readStatus;
            const Icon = getNotificationIcon(n.type);

            return (
              <div
                key={n.notificationId}
                onClick={() => {
                  markAsRead(n.notificationId);
                  if (n.ticketId) onNavigate('track-complaint', { ticketId: n.ticketId });
                }}
                className={`p-5 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isUnread ? 'bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50/70'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isUnread ? 'bg-white shadow-sm border border-slate-200' : 'bg-slate-100'
                  }`}>
                    {Icon}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm ${isUnread ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {n.title}
                      </h4>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {n.ticketId && (
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
                          {n.ticketId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {n.ticketId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n.notificationId);
                      onNavigate('track-complaint', { ticketId: n.ticketId });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 text-slate-700 hover:text-blue-700 font-bold text-xs flex items-center gap-1 transition-colors self-start sm:self-auto shadow-sm"
                  >
                    <span>View Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
