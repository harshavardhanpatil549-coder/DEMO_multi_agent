import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, ShieldCheck, Wrench, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User } from '../../types';

export const UserManagement: React.FC = () => {
  const { currentUser, switchRole, availableDemoUsers } = useAuth();
  const [users, setUsers] = useState<User[]>(availableDemoUsers);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus User Directory & Role Switcher</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select any student, facility administrator, or field technician to instantly test role-based access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => {
          const isCurrent = currentUser.id === u.id;
          const isStudent = u.role === 'student';
          const isAdmin = u.role === 'admin';

          return (
            <div 
              key={u.id}
              className={`bg-white rounded-2xl border p-6 shadow-sm transition-all flex flex-col justify-between ${
                isCurrent ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    isStudent ? 'bg-blue-100 text-blue-700' : isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {isStudent ? <GraduationCap className="w-5 h-5" /> : isAdmin ? <ShieldCheck className="w-5 h-5" /> : <Wrench className="w-5 h-5" />}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    isStudent ? 'bg-blue-50 text-blue-700' : isAdmin ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {u.role}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{u.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{u.title || u.department}</p>
                <p className="text-xs text-slate-400 font-mono mt-1">{u.email}</p>
                {u.studentId && (
                  <p className="text-xs text-blue-600 font-mono font-semibold mt-1">ID: {u.studentId}</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                {isCurrent ? (
                  <div className="py-2 text-center text-xs font-bold text-emerald-600 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Active Session</span>
                  </div>
                ) : (
                  <button
                    onClick={() => switchRole(u.role, u)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors"
                  >
                    Switch To This Persona
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
