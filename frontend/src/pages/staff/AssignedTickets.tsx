import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Search, 
  RefreshCw, 
  Send,
  Building,
  User,
  ShieldCheck,
  CheckSquare,
  Square,
  Package,
  Layers,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Complaint } from '../../types';

interface AssignedTicketsProps {
  initialTicketId?: string;
  onNavigate?: (page: string) => void;
}

export const AssignedTickets: React.FC<AssignedTicketsProps> = ({ initialTicketId, onNavigate }) => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);

  // Field Action States
  const [progressNote, setProgressNote] = useState('');
  const [updating, setUpdating] = useState(false);

  // Interactive Checklist State (parsed from SOP troubleshooting steps)
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints();
      if (res.success) {
        setTickets(res.complaints);
        if (initialTicketId) {
          const match = res.complaints.find((c: Complaint) => c.ticketId === initialTicketId);
          if (match) setSelectedTicket(match);
        } else if (res.complaints.length > 0 && !selectedTicket) {
          setSelectedTicket(res.complaints[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [initialTicketId]);

  const toggleChecklistStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    setUpdating(true);
    try {
      await api.updateComplaintStatus(selectedTicket.ticketId, {
        status: newStatus,
        noteText: progressNote 
          ? `Technician ${currentUser.name}: ${progressNote}` 
          : `Technician ${currentUser.name} marked task as ${newStatus}.`,
        authorName: currentUser.name,
        authorRole: "staff"
      });

      setProgressNote('');
      await fetchTickets();
      const updated = await api.getComplaintById(selectedTicket.ticketId);
      if (updated.success) setSelectedTicket(updated.complaint);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNoteOnly = async () => {
    if (!selectedTicket || !progressNote.trim()) return;
    setUpdating(true);
    try {
      await api.addComplaintNote(selectedTicket.ticketId, {
        author: currentUser.name,
        role: "staff",
        text: progressNote.trim()
      });
      setProgressNote('');
      const updated = await api.getComplaintById(selectedTicket.ticketId);
      if (updated.success) setSelectedTicket(updated.complaint);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  // Mock SOP Checklist steps based on ticket category/suggested action
  const getSopSteps = (ticket: Complaint) => {
    if (ticket.suggestedAction && ticket.suggestedAction.includes(';')) {
      return ticket.suggestedAction.split(';').map(s => s.trim());
    }
    return [
      `1. Perform initial safety lockout / isolate power at ${ticket.location}`,
      `2. Visually inspect physical connectors and wiring harness on ${ticket.equipment || 'fixture'}`,
      `3. Test operational voltage and continuity with digital multimeter`,
      `4. Verify functional operation with user or test presentation pattern`
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
              Technician Field Station
            </span>
            <span className="text-xs text-slate-500 font-semibold">{currentUser.department}</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Active Maintenance Work Orders
          </h2>
          <p className="text-xs text-slate-500">
            Execute physical diagnostic checklists, log replacement components, and update ticket lifecycle status.
          </p>
        </div>
        <button onClick={fetchTickets} className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 self-start sm:self-auto">
          <RefreshCw className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* DIVISION 1: Queue Column (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-[820px]">
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Work Order Queue ({tickets.length})
            </span>
            <span className="text-[10px] text-slate-400 font-bold">Newest First</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No active work orders.</div>
            ) : (
              tickets.map((t) => {
                const isSelected = selectedTicket?.ticketId === t.ticketId;
                const isHigh = t.priority === 'High';

                return (
                  <div
                    key={t.ticketId}
                    onClick={() => {
                      setSelectedTicket(t);
                      setCompletedSteps({});
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-emerald-50/80 border-l-4 border-emerald-600 shadow-sm' 
                        : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {t.ticketId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isHigh ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">{t.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{t.location}</span>
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center justify-between text-[10px]">
                      <span className="font-medium text-slate-500">{t.assignedDepartment}</span>
                      <span className={`font-bold ${
                        t.status === 'Resolved' ? 'text-emerald-600' : t.status === 'In Progress' ? 'text-blue-600' : 'text-amber-600'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DIVISION 2: Active Work Order Details & Action Workspace (8 cols) */}
        <div className="lg:col-span-8">
          {selectedTicket ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header Division */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                      {selectedTicket.ticketId}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedTicket.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedTicket.priority} Priority
                    </span>
                    <span className="text-xs font-bold text-slate-600">&bull; {selectedTicket.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{selectedTicket.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedTicket.location} &bull; Student: {selectedTicket.studentName}</p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold ${
                    selectedTicket.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedTicket.status === 'In Progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      selectedTicket.status === 'Resolved' ? 'bg-emerald-600' : selectedTicket.status === 'In Progress' ? 'bg-blue-600' : 'bg-amber-600'
                    }`} />
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Student Grievance Details Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Reported Issue Description:
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">{selectedTicket.description}</p>
              </div>

              {/* DIVISION 3: Interactive Troubleshooting SOP Checklist */}
              <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span className="font-extrabold text-emerald-950 text-xs uppercase tracking-wide">
                      Standard Diagnostic Protocol Checklist (Interactive)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {selectedTicket.protocolApplied || 'KB Protocol Applied'}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Technicians: Click to verify each diagnostic step as you complete it on site.
                </p>

                <div className="space-y-2 pt-1">
                  {getSopSteps(selectedTicket).map((step, idx) => {
                    const stepKey = `step-${idx}`;
                    const isChecked = Boolean(completedSteps[stepKey]);
                    return (
                      <div
                        key={stepKey}
                        onClick={() => toggleChecklistStep(stepKey)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked 
                            ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-semibold' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300'
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0 text-emerald-600">
                          {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-slate-400" />}
                        </div>
                        <span className={`leading-relaxed ${isChecked ? 'line-through text-emerald-800' : ''}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DIVISION 4: Spare Parts & Tools Inventory Box */}
              {selectedTicket.recommendedTools && selectedTicket.recommendedTools.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800">Recommended Spares & Diagnostic Tooling:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTicket.recommendedTools.map((part, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* DIVISION 5: Field Actions Studio */}
              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">Record Progress & Transition Ticket</h4>

                <div>
                  <label className="font-bold text-slate-700 block mb-1 text-xs">Technician Field Log & Notes</label>
                  <textarea
                    rows={3}
                    value={progressNote}
                    onChange={(e) => setProgressNote(e.target.value)}
                    placeholder="Describe actions taken (e.g. replaced lamp, tested lines, tightened valve)..."
                    className="w-full rounded-2xl border border-slate-200 p-3.5 text-xs outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleAddNoteOnly}
                    disabled={updating || !progressNote.trim()}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors disabled:opacity-50"
                  >
                    Log Note Only
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('In Progress')}
                    disabled={updating || selectedTicket.status === 'In Progress'}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Set "In Progress"</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus('Completed')}
                    disabled={updating || selectedTicket.status === 'Completed' || selectedTicket.status === 'Resolved'}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Task Completed (Ready for Admin Sign-Off)</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  * Marking a task as "Completed" dispatches an alert to Facilities Director Dr. Vikram Malhotra to physically confirm resolution.
                </p>
              </div>

              {/* Maintenance History */}
              {selectedTicket.notes && selectedTicket.notes.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-xs mb-3">Field Action Progression History</h4>
                  <div className="space-y-2">
                    {selectedTicket.notes.map((n, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <div className="flex justify-between text-slate-500 mb-0.5">
                          <span className="font-bold text-slate-800">{n.author} ({n.role})</span>
                          <span className="text-[10px]">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a work order from the left queue to view the full operational diagnostic studio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
