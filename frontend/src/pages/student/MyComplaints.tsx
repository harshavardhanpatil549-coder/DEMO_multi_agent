import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, ChevronRight, AlertCircle, Building, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Complaint } from '../../types';

interface MyComplaintsProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectComplaint?: (ticketId: string) => void;
}

export const MyComplaints: React.FC<MyComplaintsProps> = ({ onNavigate, onSelectComplaint }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints({ studentId: currentUser.studentId });
      if (res.success) {
        setComplaints(res.complaints);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [currentUser]);

  const filtered = complaints.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.ticketId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Complaint History</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track historical maintenance requests submitted from your student account.
          </p>
        </div>

        <button
          onClick={() => onNavigate('submit-complaint')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition-all self-start sm:self-auto"
        >
          + Submit New Issue
        </button>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ticket ID, title, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={fetchComplaints}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Cards View */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span>Loading complaints...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No complaints found. Submit a new issue to test the autonomous multi-agent system!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => {
            const isHigh = c.priority === 'High';
            return (
              <div 
                key={c.ticketId}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.ticketId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isHigh ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {c.priority} Priority
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Location:</span>
                      <span className="font-medium truncate block">{c.location}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Assigned Department:</span>
                      <span className="font-medium truncate block">{c.assignedDepartment}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                    c.status === 'Resolved' ? 'text-emerald-600' : c.status === 'In Progress' ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      c.status === 'Resolved' ? 'bg-emerald-600' : c.status === 'In Progress' ? 'bg-blue-600' : 'bg-amber-600'
                    }`} />
                    {c.status}
                  </span>

                  <button
                    onClick={() => {
                      if (onSelectComplaint) onSelectComplaint(c.ticketId);
                      onNavigate('track-complaint', { ticketId: c.ticketId });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                  >
                    <span>View Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
