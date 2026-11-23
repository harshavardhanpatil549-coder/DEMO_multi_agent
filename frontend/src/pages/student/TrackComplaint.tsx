import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Building, 
  User, 
  Calendar,
  Sparkles,
  Bot,
  RefreshCw,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import { Complaint } from '../../types';

interface TrackComplaintProps {
  initialTicketId?: string;
  onNavigate?: (page: string) => void;
}

export const TrackComplaint: React.FC<TrackComplaintProps> = ({ initialTicketId, onNavigate }) => {
  const [ticketQuery, setTicketQuery] = useState(initialTicketId || 'CF-2026-0001');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTicket = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getComplaintById(id.trim());
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
      } else {
        setComplaint(null);
        setError(`No ticket found matching ID "${id}".`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to retrieve ticket.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicketId) {
      setTicketQuery(initialTicketId);
      fetchTicket(initialTicketId);
    } else {
      fetchTicket('CF-2026-0001');
    }
  }, [initialTicketId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTicket(ticketQuery);
  };

  // Progression milestones
  const getTimelineSteps = (c: Complaint) => {
    const isResolved = c.status === 'Resolved';
    const isInProgress = c.status === 'In Progress' || isResolved;
    const isCompleted = c.status === 'Completed' || isResolved;

    return [
      {
        label: "Complaint Submitted",
        sub: `Logged by ${c.studentName}`,
        date: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        completed: true,
        type: "user"
      },
      {
        label: "AI Multi-Agent Analysis",
        sub: `Category: ${c.category}`,
        date: "Completed in ~1.4s",
        completed: true,
        type: "ai"
      },
      {
        label: "Priority Assigned",
        sub: `${c.priority} Priority (${c.priorityReason?.slice(0, 45)}...)`,
        date: "Autonomous Urgency Score",
        completed: true,
        type: "ai"
      },
      {
        label: "Department Assigned",
        sub: `Routed to ${c.assignedDepartment} (${c.assignedStaff})`,
        date: "Auto-Dispatched",
        completed: true,
        type: "ai"
      },
      {
        label: "Maintenance In Progress",
        sub: isInProgress ? "Technician actively working on site" : "Queued in technician backlog",
        date: isInProgress ? "Underway" : "Pending",
        completed: isInProgress,
        type: "physical"
      },
      {
        label: "Confirmed Resolved",
        sub: isResolved 
          ? `Physically confirmed by ${c.resolvedBy || 'Facilities Director'}` 
          : "Awaiting physical resolution & admin sign-off",
        date: isResolved ? new Date(c.resolvedAt || c.updatedAt).toLocaleDateString() : "Pending",
        completed: isResolved,
        type: "physical"
      }
    ];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Track Complaint Status</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Enter your unique complaint reference number (e.g. CF-2026-0001) to view the multi-agent AI breakdown and real-world physical maintenance status.
        </p>

        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={ticketQuery}
              onChange={(e) => setTicketQuery(e.target.value)}
              placeholder="e.g. CF-2026-0001, CF-2026-0004"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-sm font-mono font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Search</span>}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Ticket Details & Timeline */}
      {complaint && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          {/* Main Status Header Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    {complaint.ticketId}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    complaint.priority === 'High' 
                      ? 'bg-red-100 text-red-700 border border-red-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}>
                    {complaint.priority} Priority
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-2">{complaint.title}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <Building className="w-3.5 h-3.5" />
                  <span>{complaint.location}</span>
                  <span>&bull;</span>
                  <span>Reported on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                </p>
              </div>

              {/* Status Pill */}
              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Current Status</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${
                  complaint.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : complaint.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    complaint.status === 'Resolved' ? 'bg-emerald-600' : complaint.status === 'In Progress' ? 'bg-blue-600' : 'bg-amber-600'
                  }`} />
                  {complaint.status}
                </span>
              </div>
            </div>

            {/* Visual Progress Timeline */}
            <div className="py-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-6">
                Lifecycle Milestones: AI Processing vs. Physical Resolution
              </span>

              <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {getTimelineSteps(complaint).map((st, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    {/* Circle Dot */}
                    <div className={`absolute -left-6 sm:-left-8 mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white ${
                      st.completed 
                        ? 'border-emerald-500 text-emerald-600 ring-2 ring-emerald-100' 
                        : 'border-slate-300 text-slate-300'
                    }`}>
                      {st.completed ? <CheckCircle2 className="w-3.5 h-3.5 fill-current" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                    </div>

                    <div className="flex-1 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-slate-900">{st.label}</p>
                          {st.type === 'ai' && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-100 text-blue-700 rounded">AI</span>
                          )}
                          {st.type === 'physical' && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-emerald-100 text-emerald-700 rounded">Physical</span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{st.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{st.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent AI Agent Decision Breakdown */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-sm">Transparent Multi-Agent Rationale</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Agent 1 & 2 */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Agent 1: Detection & Category</span>
                    <p className="font-semibold text-slate-800">{complaint.category} &bull; {complaint.equipment || 'Identified Fixture'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Agent 2: Urgency Explanation</span>
                    <p className="text-slate-700 leading-relaxed">{complaint.priorityReason}</p>
                  </div>
                </div>

                {/* Agent 3 & 4 */}
                <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Agent 3: Investigation Findings</span>
                    <p className="text-slate-700 leading-relaxed">{complaint.investigationSummary || 'Protocol KB-01 verified against campus maintenance rules.'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">Technician Prescribed Action</span>
                    <p className="text-slate-700 font-medium">{complaint.suggestedAction}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Activity Log */}
            {complaint.notes && complaint.notes.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm mb-3">Maintenance Updates & Audit Notes</h4>
                <div className="space-y-2.5">
                  {complaint.notes.map((n, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex items-center justify-between text-slate-500 mb-1">
                        <span className="font-bold text-slate-800">{n.author} ({n.role})</span>
                        <span className="text-[10px]">{new Date(n.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-700">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
