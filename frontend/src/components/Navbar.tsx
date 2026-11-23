import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Play, 
  X, 
  ChevronDown, 
  UserCheck,
  Home,
  GraduationCap,
  Wrench,
  ShieldCheck,
  Search,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSystem } from '../context/SystemContext';

interface NavbarProps {
  pageTitle: string;
  onOpenMobileMenu: () => void;
  onNavigate: (page: string, params?: any) => void;
  onOpenLiveWorkflow?: (workflowId: string) => void;
  activePortal: 'public' | 'student' | 'staff' | 'admin';
  onChangePortal: (portal: 'public' | 'student' | 'staff' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  pageTitle, 
  onOpenMobileMenu, 
  onNavigate,
  onOpenLiveWorkflow,
  activePortal,
  onChangePortal
}) => {
  const { currentUser, currentRole, switchRole, availableDemoUsers } = useAuth();
  const { systemStatus, notifications, unreadCount, markAsRead, markAllAsRead, triggerGlobalDemo } = useSystem();
  
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const handleRunOfficialDemo = async () => {
    setIsDemoRunning(true);
    try {
      const res = await triggerGlobalDemo('official');
      if (res.workflowId && onOpenLiveWorkflow) {
        onOpenLiveWorkflow(res.workflowId);
      }
      onChangePortal('admin');
      onNavigate('command-center');
    } catch (e) {
      console.error(e);
    } finally {
      setIsDemoRunning(false);
    }
  };

  const portals = [
    { id: 'public', label: 'Public Home', icon: Home, route: 'landing' },
    { id: 'student', label: 'Student Portal', icon: GraduationCap, route: 'student-dashboard', role: 'student' as const },
    { id: 'staff', label: 'Staff Field App', icon: Wrench, route: 'staff-dashboard', role: 'staff' as const },
    { id: 'admin', label: 'Admin Console', icon: ShieldCheck, route: 'admin-dashboard', role: 'admin' as const },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Utility Row */}
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 border-b border-slate-100">
        {/* Left: Mobile hamburger & Active Page Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-slate-900 leading-tight">{pageTitle}</h1>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                activePortal === 'student' 
                  ? 'bg-blue-100 text-blue-700' 
                  : activePortal === 'staff'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activePortal === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {activePortal} Division
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">CampusFix AI Autonomous Platform</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Trigger Button (Crucial for Judges) */}
          <button
            onClick={handleRunOfficialDemo}
            disabled={isDemoRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            title="Runs the required demonstration: Classroom 204 Projector issue with 4 AI agents"
          >
            {isDemoRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="hidden md:inline">Run Official Demo (Classroom 204)</span>
            <span className="md:hidden">Demo</span>
          </button>

          {/* AI Status Badge */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-800">
              {systemStatus?.aiProvider?.isConfigured ? 'Gemini 1.5 Flash' : 'Cognitive Multi-Agent'}
            </span>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentUser.name.split(' ')[0]} <span className="font-normal text-slate-500">({currentUser.role})</span></span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setShowRoleMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Demo Persona Switcher</p>
                  <p className="text-xs text-slate-500">Switch between different user roles</p>
                </div>
                {availableDemoUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      switchRole(user.role, user);
                      if (user.role === 'student') { onChangePortal('student'); onNavigate('student-dashboard'); }
                      else if (user.role === 'admin') { onChangePortal('admin'); onNavigate('admin-dashboard'); }
                      else { onChangePortal('staff'); onNavigate('staff-dashboard'); }
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                      currentUser.id === user.id ? 'bg-blue-50/80 font-bold text-blue-700' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 capitalize">{user.role} &bull; {user.title || user.department}</p>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifDrawer && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <span className="font-bold text-sm">System Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 rounded-full text-white">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-[11px] text-slate-300 hover:text-white underline"
                    >
                      Mark all read
                    </button>
                    <button 
                      onClick={() => setShowNotifDrawer(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No notifications right now.
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((n) => (
                      <div
                        key={n.notificationId}
                        onClick={() => {
                          markAsRead(n.notificationId);
                          if (n.ticketId) {
                            onChangePortal('student');
                            onNavigate('track-complaint', { ticketId: n.ticketId });
                          }
                        }}
                        className={`p-3 text-xs cursor-pointer transition-colors hover:bg-slate-50 ${
                          !n.readStatus ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-900">{n.title}</p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                        {n.ticketId && (
                          <span className="inline-block mt-1 font-mono text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                            {n.ticketId}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary UI/UX Portal Divisions Bar */}
      <div className="px-4 sm:px-6 lg:px-8 bg-slate-50/90 border-b border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-2 py-2 min-w-max">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Portal Divisions:
          </span>

          {portals.map((portal) => {
            const Icon = portal.icon;
            const isSelected = activePortal === portal.id;
            return (
              <button
                key={portal.id}
                onClick={() => {
                  onChangePortal(portal.id as any);
                  if (portal.role) {
                    switchRole(portal.role);
                  }
                  onNavigate(portal.route);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? portal.id === 'student'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : portal.id === 'staff'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                      : portal.id === 'admin'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                      : 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{portal.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
