import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  ChevronRight, 
  Building, 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  X,
  Sparkles,
  Bot,
  Layers,
  Sliders,
  Send,
  Download
} from 'lucide-react';
import { api } from '../../services/api';
import { Complaint, Department } from '../../types';

interface AllComplaintsProps {
  initialTicketId?: string;
  onNavigate?: (page: string) => void;
}

export const AllComplaints: React.FC<AllComplaintsProps> = ({ initialTicketId, onNavigate }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialTicketId || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Selected Ticket for Modal / Drawer Management
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [reassignDept, setReassignDept] = useState<string>('');
  const [reassignStaff, setReassignStaff] = useState<string>('');
  const [adminNote, setAdminNote] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, deptRes] = await Promise.all([
        api.getComplaints(),
        api.getDepartments()
      ]);
      if (compRes.success) {
        setComplaints(compRes.complaints);
        if (initialTicketId) {
          const match = compRes.complaints.find((c: Complaint) => c.ticketId === initialTicketId);
          if (match) setSelectedTicket(match);
        }
      }
      if (deptRes.success) setDepartments(deptRes.departments);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [initialTicketId]);

  useEffect(() => {
    if (selectedTicket) {
      setUpdateStatus(selectedTicket.status);
      setReassignDept(selectedTicket.assignedDepartment);
      setReassignStaff(selectedTicket.assignedStaff);
    }
  }, [selectedTicket]);

  const handleSaveTicketUpdates = async () => {
    if (!selectedTicket) return;
    setSaving(true);
    try {
      // 1. Status update if changed
      if (updateStatus !== selectedTicket.status) {
        await api.updateComplaintStatus(selectedTicket.ticketId, {
          status: updateStatus,
          noteText: adminNote ? `Admin update: ${adminNote}` : `Status updated to ${updateStatus} by Administrator`,
          authorName: "Dr. Vikram Malhotra",
          authorRole: "admin"
        });
      }

      // 2. Department or Staff reassignment if changed
      if (reassignDept !== selectedTicket.assignedDepartment || reassignStaff !== selectedTicket.assignedStaff) {
        await api.reassignComplaint(selectedTicket.ticketId, {
          assignedDepartment: reassignDept,
          assignedStaff: reassignStaff,
          noteText: `Reassigned to ${reassignDept} (Staff: ${reassignStaff}) by Administrator`,
          authorName: "Dr. Vikram Malhotra"
        });
      }

      // Refresh list
      await fetchData();
      const updated = await api.getComplaintById(selectedTicket.ticketId);
      if (updated.success) setSelectedTicket(updated.complaint);
      setAdminNote('');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const filtered = complaints.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (departmentFilter !== 'All' && c.assignedDepartment !== departmentFilter) return false;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance Tickets Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee autonomous AI-dispatched tickets, reassign departments, and physically verify task completion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={api.getExportCsvUrl()}
            download
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ticket, room, issue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none focus:border-blue-500"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <button
            onClick={fetchData}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading tickets...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">No tickets matching selected filters.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Title & Problem</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr 
                    key={c.ticketId}
                    onClick={() => setSelectedTicket(c)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
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
                    <td className="py-3.5 px-4 text-slate-600">{c.assignedStaff}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicket(c);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition-colors"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Ticket Details & Administrative Action Drawer/Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {selectedTicket.ticketId}
                  </span>
                  <span className="text-xs font-bold text-slate-400">&bull; {selectedTicket.category}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{selectedTicket.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Reported by {selectedTicket.studentName} ({selectedTicket.studentId})</p>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Agent Rationale Box */}
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs space-y-2">
              <span className="font-bold text-blue-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Investigation Rationale
              </span>
              <p className="text-slate-700 leading-relaxed">
                <strong>Priority Rationale:</strong> {selectedTicket.priorityReason}
              </p>
              <p className="text-slate-700 leading-relaxed">
                <strong>Suggested Repair Action:</strong> {selectedTicket.suggestedAction}
              </p>
            </div>

            {/* Admin Management Controls */}
            <div className="space-y-4 pt-2">
              <h4 className="font-bold text-slate-900 text-sm">Administrative Override & Updates</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Status selector */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Update Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500 font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed (Pending Verification)</option>
                    <option value="Resolved">Resolved (Confirmed Physical Repair)</option>
                  </select>
                </div>

                {/* Department Reassign */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Reassign Department</label>
                  <select
                    value={reassignDept}
                    onChange={(e) => {
                      setReassignDept(e.target.value);
                      const dept = departments.find(d => d.name === e.target.value);
                      if (dept && dept.staff?.[0]) setReassignStaff(dept.staff[0]);
                    }}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Staff Assignment */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Staff Technician</label>
                  <input
                    type="text"
                    value={reassignStaff}
                    onChange={(e) => setReassignStaff(e.target.value)}
                    placeholder="Technician Name"
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Internal Admin Note */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 text-xs">Internal Administrative Note</label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add notes on physical inspection, verified parts replacement, or sign-off remarks..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTicketUpdates}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow flex items-center gap-1.5 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save Ticket Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
