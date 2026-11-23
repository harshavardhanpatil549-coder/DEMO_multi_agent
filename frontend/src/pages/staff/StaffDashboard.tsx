import React, { useState, useEffect } from 'react';
import { Wrench, Clock, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Complaint } from '../../types';

interface StaffDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectTicket?: (ticketId: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigate, onSelectTicket }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints();
      if (res.success) {
        // Filter for this staff's department or assigned name
        const deptTickets = res.complaints.filter((c: Complaint) => 
          c.assignedDepartment.toLowerCase().includes((currentUser.department || '').toLowerCase().split(' ')[0]) ||
          (c.assignedStaff && c.assignedStaff.includes(currentUser.name))
        );
        setComplaints(deptTickets.length > 0 ? deptTickets : res.complaints);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [currentUser]);

  const active = complaints.filter(c => c.status !== 'Resolved');
  const highPriority = active.filter(c => c.priority === 'High');
  const completed = complaints.filter(c => c.status === 'Completed' || c.status === 'Resolved');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            {currentUser.department} &bull; {currentUser.title}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Field Technician Workspace
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Review autonomous AI investigation suggestions, update maintenance progress in the field, and submit completed tasks for admin sign-off.
          </p>
        </div>

        <button
          onClick={() => onNavigate('assigned-tickets')}
          className="px-6 py-3.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-sm shadow-lg flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Wrench className="w-4 h-4 text-emerald-700" />
          <span>View Assigned Queue</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Queue</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{active.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Urgent High-Priority</p>
            <p className="text-3xl font-black text-red-600 mt-1">{highPriority.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed / Signed Off</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">{completed.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Assigned Tasks List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Current Assigned Tickets</h3>
            <p className="text-xs text-slate-500">Tickets assigned to {currentUser.name} or {currentUser.department}</p>
          </div>
          <button
            onClick={() => onNavigate('assigned-tickets')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Full Queue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading assignments...</div>
          ) : active.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No pending assignments in your queue!</div>
          ) : (
            active.map((t) => (
              <div key={t.ticketId} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {t.ticketId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-slate-700">&bull; {t.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{t.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.location}</p>
                  {t.suggestedAction && (
                    <p className="text-xs text-emerald-700 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 mt-2">
                      <span className="font-bold">AI Recommended Action: </span>{t.suggestedAction}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => onNavigate('assigned-tickets', { ticketId: t.ticketId })}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-1.5 whitespace-nowrap self-start sm:self-auto"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Update Progress</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
