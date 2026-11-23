import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  TrendingUp, 
  Search, 
  Filter, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  Wrench,
  Users,
  Activity,
  Layers,
  CheckSquare
} from 'lucide-react';
import { api } from '../../services/api';
import { Complaint, Department } from '../../types';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectComplaint?: (ticketId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, onSelectComplaint }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'urgent' | 'completed'>('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, deptRes] = await Promise.all([
        api.getComplaints(),
        api.getDepartments()
      ]);
      if (compRes.success) setComplaints(compRes.complaints);
      if (deptRes.success) setDepartments(deptRes.departments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const completed = complaints.filter(c => c.status === 'Completed').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;
  const highPriority = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved').length;

  const urgentComplaints = complaints.filter(c => c.priority === 'High' && c.status !== 'Resolved');
  const needsVerification = complaints.filter(c => c.status === 'Completed');

  const handleQuickResolve = async (ticketId: string) => {
    try {
      await api.updateComplaintStatus(ticketId, {
        status: 'Resolved',
        noteText: 'Facilities Director physically inspected area and confirmed resolution.',
        authorName: 'Dr. Vikram Malhotra',
        authorRole: 'admin'
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8">
      {/* SECTION 1: Executive Facilities Console Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
              Directorate of Campus Facilities
            </span>
            <span className="text-xs text-slate-400 font-mono">Executive Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Institutional Operations & Triage
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Oversee autonomous AI-dispatched tickets, monitor departmental workload capacities, and authorize verified physical repair closures.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('command-center')}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
          >
            <Cpu className="w-4 h-4" />
            <span>Open AI Command Center</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Operations Metrics & SLA Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Tickets</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{total}</p>
          <span className="text-[10px] text-slate-500">Persistent database</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Pending Triage</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{pending}</p>
          <span className="text-[10px] text-amber-700">Awaiting technician</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm">
          <p className="text-[10px] font-black text-red-600 uppercase tracking-wider">Urgent High Priority</p>
          <p className="text-2xl font-black text-red-600 mt-1">{highPriority}</p>
          <span className="text-[10px] text-red-700 font-bold animate-pulse">SLA escalated</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">In Progress</p>
          <p className="text-2xl font-black text-blue-600 mt-1">{inProgress}</p>
          <span className="text-[10px] text-blue-700">Staff dispatched</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-purple-500 uppercase tracking-wider">Needs Sign-off</p>
          <p className="text-2xl font-black text-purple-600 mt-1">{completed}</p>
          <span className="text-[10px] text-purple-700">Awaiting admin</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-wider">Verified Resolved</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{resolved}</p>
          <span className="text-[10px] text-emerald-700">Confirmed on site</span>
        </div>
      </div>

      {/* SECTION 3: Departmental Workload & Capacity Progress Bars */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Departmental Workload & Capacity Distribution</h3>
            <p className="text-xs text-slate-500">Live allocation based on active assigned tickets vs staff staffing</p>
          </div>
          <button 
            onClick={() => onNavigate('departments')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Manage Divisions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => {
            const deptTickets = complaints.filter(c => c.assignedDepartment === dept.name && c.status !== 'Resolved');
            const loadPercent = Math.min(100, Math.round((deptTickets.length / Math.max(1, dept.staff.length * 3)) * 100));

            return (
              <div key={dept.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{dept.name}</span>
                  <span className="font-mono text-slate-500 font-bold">{deptTickets.length} active</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      loadPercent > 80 ? 'bg-red-500' : loadPercent > 50 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.max(15, loadPercent)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Lead: {dept.lead}</span>
                  <span>SLA: {dept.slaHours}h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Urgent & Verification Alert Strip */}
      {needsVerification.length > 0 && (
        <div className="bg-purple-900 text-white rounded-3xl p-5 border border-purple-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-300" />
              <h4 className="font-bold text-sm">Action Needed: {needsVerification.length} Task(s) Completed by Technicians</h4>
            </div>
            <p className="text-xs text-purple-200 mt-0.5">
              Field staff have marked these tasks as completed. Facilities Director confirmation is required to close the loop.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {needsVerification.slice(0, 1).map((t) => (
              <button
                key={t.ticketId}
                onClick={() => handleQuickResolve(t.ticketId)}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow transition-colors whitespace-nowrap"
              >
                Sign Off {t.ticketId} (Verify Resolved)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Active Tickets Feed & Action Drawer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">All Campus Work Orders</h3>
            <p className="text-xs text-slate-500">Live operational feed from persistent database</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All ({total})
            </button>
            <button
              onClick={() => setActiveTab('urgent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'urgent' ? 'bg-red-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Urgent ({urgentComplaints.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'completed' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Sign-Off ({needsVerification.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading...</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Problem Summary</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Staff Lead</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'urgent' ? urgentComplaints : activeTab === 'completed' ? needsVerification : complaints).map((c) => (
                  <tr key={c.ticketId} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">{c.ticketId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{c.title}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.location}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{c.assignedDepartment}</td>
                    <td className="py-3.5 px-4 text-slate-600">{c.assignedStaff || 'Unassigned'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : c.status === 'Completed' ? 'bg-purple-100 text-purple-800' : c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {c.status === 'Completed' ? (
                        <button
                          onClick={() => handleQuickResolve(c.ticketId)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow transition-colors"
                        >
                          Confirm Resolved
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigate('all-complaints', { ticketId: c.ticketId })}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white font-semibold text-slate-700 transition-colors"
                        >
                          Manage
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
