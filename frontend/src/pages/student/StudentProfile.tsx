import React from 'react';
import { User, GraduationCap, Building, Mail, Phone, ShieldCheck, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const StudentProfile: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-blue-500/30">
            {currentUser.name.charAt(0)}
          </div>
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 capitalize">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              Student ID: {currentUser.studentId || 'STU-2026-1049'}
            </p>
            <p className="text-xs text-slate-600 mt-1">
              Department of {currentUser.department || 'Computer Science & Engineering'}
            </p>
          </div>
        </div>

        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <Mail className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-slate-400 block text-[10px]">Campus Email:</span>
              <span className="font-semibold text-slate-800">{currentUser.email}</span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
            <Building className="w-4 h-4 text-blue-600" />
            <div>
              <span className="text-slate-400 block text-[10px]">Hostel / Campus Residence:</span>
              <span className="font-semibold text-slate-800">{currentUser.hostelOrBuilding || 'Aryabhatta Hall, Room 302'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
