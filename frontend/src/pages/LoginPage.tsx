import React from 'react';
import { UserCheck, GraduationCap, ShieldCheck, Wrench, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { availableDemoUsers, currentUser, switchRole } = useAuth();

  const handleSelectUser = (user: User) => {
    switchRole(user.role, user);
    if (user.role === 'student') onNavigate('student-dashboard');
    else if (user.role === 'admin') onNavigate('admin-dashboard');
    else onNavigate('staff-dashboard');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'student': return GraduationCap;
      case 'admin': return ShieldCheck;
      default: return Wrench;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Hackathon Authentication</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Select Demo Persona & Portal</h1>
        <p className="text-sm text-slate-600 mt-2">
          Experience CampusFix AI from all three operational perspectives: Students reporting issues, Facilities Directors managing tickets, and Field Technicians performing repairs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Group */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Submit issues, watch real-time AI agents process complaints, and track ticket milestones.
            </p>

            <div className="space-y-2.5">
              {availableDemoUsers.filter(u => u.role === 'student').map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    currentUser.id === user.id 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.studentId} &bull; {user.department}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectUser(availableDemoUsers[0])}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Enter as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Group */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Admin Portal</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Access AI Agent Command Center, oversee tickets, reassign departments, and confirm physical resolution.
            </p>

            <div className="space-y-2.5">
              {availableDemoUsers.filter(u => u.role === 'admin').map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    currentUser.id === user.id 
                      ? 'border-amber-600 bg-amber-50/50 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.title}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectUser(availableDemoUsers.find(u => u.role === 'admin')!)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Enter as Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Staff Group */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Staff Portal</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Inspect assigned equipment tasks, read AI forensic recommendations, and update repair progress.
            </p>

            <div className="space-y-2.5">
              {availableDemoUsers.filter(u => u.role === 'staff').map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    currentUser.id === user.id 
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-sm' 
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <p className="font-bold text-xs text-slate-900">{user.name}</p>
                  <p className="text-[11px] text-slate-500">{user.title} ({user.department})</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleSelectUser(availableDemoUsers.find(u => u.role === 'staff')!)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Enter as Staff</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
