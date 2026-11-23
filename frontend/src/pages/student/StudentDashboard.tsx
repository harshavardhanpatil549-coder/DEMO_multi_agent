import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Building,
  RefreshCw,
  Sparkles,
  Layers,
  Sliders,
  MapPin,
  Laptop,
  Lightbulb,
  Droplet,
  Flame,
  Wifi
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Complaint } from '../../types';

interface StudentDashboardProps {
  onNavigate: (page: string, params?: any) => void;
  onSelectComplaint?: (ticketId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate, onSelectComplaint }) => {
  const { currentUser } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeZone, setActiveZone] = useState('All Zones');

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

  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const campusZones = [
    { name: "Academic Block A", count: complaints.filter(c => c.location.includes("Block A")).length, icon: Laptop, color: "text-blue-600 bg-blue-50" },
    { name: "Science Complex", count: complaints.filter(c => c.location.includes("Science")).length, icon: Droplet, color: "text-cyan-600 bg-cyan-50" },
    { name: "Central Library", count: complaints.filter(c => c.location.includes("Library")).length, icon: Lightbulb, color: "text-amber-600 bg-amber-50" },
    { name: "Turing Lab Complex", count: complaints.filter(c => c.location.includes("Turing")).length, icon: Wifi, color: "text-purple-600 bg-purple-50" }
  ];

  const filtered = complaints.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (activeZone !== 'All Zones' && !c.location.includes(activeZone.split(' ')[0])) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        c.ticketId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* SECTION 1: Welcome & Quick Action Hero */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-blue-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold backdrop-blur-sm border border-white/10">
              Student Service Hub &bull; {currentUser.department}
            </span>
            <span className="text-xs text-blue-300 font-mono">ID: {currentUser.studentId}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Campus Maintenance Central
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            Report broken classroom gear, electrical or plumbing hazards. The 4 collaborating AI agents will autonomously extract details, prioritize urgency, and dispatch work tickets.
          </p>
        </div>

        <button
          onClick={() => onNavigate('submit-complaint')}
          className="px-6 py-3.5 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all self-start md:self-auto group"
        >
          <PlusCircle className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform" />
          <span>Report New Grievance</span>
        </button>
      </div>

      {/* SECTION 2: Metric Tiles Division */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Grievances</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{total}</p>
            <p className="text-[11px] text-slate-500 mt-1">Logged by your ID</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">Pending AI / Triage</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{pending}</p>
            <p className="text-[11px] text-amber-700/80 mt-1">Under agent inspection</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Repair In Progress</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{inProgress}</p>
            <p className="text-[11px] text-blue-700/80 mt-1">Technician on site</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <RefreshCw className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">Confirmed Resolved</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{resolved}</p>
            <p className="text-[11px] text-emerald-700/80 mt-1">Physically verified</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 3: Campus Facilities Zones Division */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Campus Facility Zones</h3>
            <p className="text-xs text-slate-500">Filter your issues by building location or quickly launch a report for that block</p>
          </div>
          <button 
            onClick={() => setActiveZone('All Zones')}
            className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
              activeZone === 'All Zones' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Show All Zones
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {campusZones.map((z, idx) => {
            const Icon = z.icon;
            const isSelected = activeZone === z.name;
            return (
              <button
                key={idx}
                onClick={() => setActiveZone(z.name)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${z.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="font-bold text-xs text-slate-900">{z.name}</p>
                <span className="text-[10px] text-slate-500 mt-0.5 block">{z.count} recorded complaints</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Active Complaints Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-base">Complaints & Tickets Feed</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                {filtered.length} visible
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Track AI agent progress and technician assignment</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search ticket, room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-blue-500 transition-all w-48 sm:w-56"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <button
              onClick={fetchComplaints}
              className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
              title="Refresh table"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              <span>Loading complaints from database...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No complaints found matching current filters.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Issue Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => {
                  const isHigh = c.priority === 'High';
                  const isMed = c.priority === 'Medium';

                  return (
                    <tr key={c.ticketId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                        {c.ticketId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {c.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {c.location}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isHigh 
                            ? 'bg-red-100 text-red-700 border border-red-200' 
                            : isMed
                            ? 'bg-amber-100 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-semibold">
                        {c.assignedDepartment}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          c.status === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Resolved' ? 'bg-emerald-600' : c.status === 'In Progress' ? 'bg-blue-600' : 'bg-amber-600'
                          }`} />
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            if (onSelectComplaint) onSelectComplaint(c.ticketId);
                            onNavigate('track-complaint', { ticketId: c.ticketId });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <span>Track AI Flow</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
