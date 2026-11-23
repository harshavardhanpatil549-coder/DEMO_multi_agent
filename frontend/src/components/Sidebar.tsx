import React from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  PlusCircle, 
  ListFilter, 
  Search, 
  Bell, 
  User as UserIcon, 
  Cpu, 
  FileText, 
  Building2, 
  BarChart3, 
  BookOpen, 
  Users, 
  Settings, 
  Wrench, 
  CheckCircle2, 
  HelpCircle, 
  Info, 
  Home, 
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSystem } from '../context/SystemContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  activePortal: 'public' | 'student' | 'staff' | 'admin';
  onChangePortal: (portal: 'public' | 'student' | 'staff' | 'admin') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate, 
  isOpen, 
  onClose,
  activePortal,
  onChangePortal
}) => {
  const { currentUser, currentRole, switchRole } = useAuth();
  const { unreadCount } = useSystem();

  const publicNav = [
    { id: 'landing', label: 'Landing Page', icon: Home },
    { id: 'about', label: 'About CampusFix', icon: Info },
    { id: 'how-it-works', label: 'How It Works', icon: HelpCircle },
    { id: 'login', label: 'Role Switcher', icon: Users }
  ];

  const studentNav = [
    { id: 'student-dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { id: 'submit-complaint', label: 'Report New Issue', icon: PlusCircle, highlight: true },
    { id: 'my-complaints', label: 'My Complaints', icon: ListFilter },
    { id: 'track-complaint', label: 'Track Complaint', icon: Search },
    { id: 'student-notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'student-profile', label: 'My Profile', icon: UserIcon }
  ];

  const adminNav = [
    { id: 'admin-dashboard', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'all-complaints', label: 'All Complaints', icon: ListFilter },
    { id: 'command-center', label: 'AI Command Center', icon: Cpu, highlight: true, glow: true },
    { id: 'agent-logs', label: 'Agent Execution Logs', icon: FileText },
    { id: 'departments', label: 'Departments & Staff', icon: Building2 },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
    { id: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen },
    { id: 'user-management', label: 'User Directory', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  const staffNav = [
    { id: 'staff-dashboard', label: 'Staff Dashboard', icon: LayoutDashboard },
    { id: 'assigned-tickets', label: 'Assigned Work Orders', icon: Wrench, highlight: true },
    { id: 'completed-tasks', label: 'Completed Tasks', icon: CheckCircle2 },
    { id: 'staff-profile', label: 'Staff Profile', icon: UserIcon }
  ];

  const renderNavGroup = (title: string, items: any[]) => (
    <div className="mb-5">
      <div className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : item.highlight
                  ? 'text-blue-400 hover:bg-slate-800/80 hover:text-blue-300'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              } ${item.glow && !isActive ? 'border border-blue-500/30 bg-blue-500/10' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                  isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                }`}>
                  {item.badge}
                </span>
              ) : isActive ? (
                <ChevronRight className="w-3.5 h-3.5 opacity-75" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => { onChangePortal('public'); onNavigate('landing'); }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">CampusFix</span>
                <span className="px-1.5 py-0.5 text-[10px] font-black rounded-md bg-blue-500 text-white">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Autonomous Maintenance</p>
            </div>
          </div>
        </div>

        {/* Portal Divisions Quick Switcher */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 px-1">
            Active Portal
          </span>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => {
                onChangePortal('student');
                switchRole('student');
                onNavigate('student-dashboard');
              }}
              className={`py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                activePortal === 'student'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🎓 Student
            </button>
            <button
              onClick={() => {
                onChangePortal('staff');
                switchRole('staff');
                onNavigate('staff-dashboard');
              }}
              className={`py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                activePortal === 'staff'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🔧 Staff
            </button>
            <button
              onClick={() => {
                onChangePortal('admin');
                switchRole('admin');
                onNavigate('admin-dashboard');
              }}
              className={`py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all ${
                activePortal === 'admin'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Scrollable Nav Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {activePortal === 'student' && renderNavGroup('Student Actions', studentNav)}
          {activePortal === 'admin' && renderNavGroup('Admin Oversight', adminNav)}
          {activePortal === 'staff' && renderNavGroup('Technician Tasks', staffNav)}
          {activePortal === 'public' && renderNavGroup('Public Overview', publicNav)}

          {/* Secondary Groups */}
          {activePortal !== 'public' && (
            <div className="pt-3 border-t border-slate-800/60">
              {renderNavGroup('Public Overview', publicNav)}
            </div>
          )}
        </div>

        {/* User Persona Profile Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  currentUser.role === 'admin' ? 'bg-amber-400' : currentUser.role === 'staff' ? 'bg-emerald-400' : 'bg-blue-400'
                }`} />
                <p className="text-[11px] text-slate-400 capitalize">{currentUser.role} &bull; {currentUser.title || currentUser.department}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
