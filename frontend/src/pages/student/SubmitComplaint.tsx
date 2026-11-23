import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  Upload, 
  MapPin, 
  Building, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Play,
  ArrowRight,
  Tv,
  Droplet,
  Zap,
  Wind,
  Wifi,
  Armchair,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { AgentWorkflowVisualizer } from '../../components/AgentWorkflowVisualizer';

interface SubmitComplaintProps {
  onNavigate: (page: string, params?: any) => void;
  onOpenLiveWorkflow?: (workflowId: string) => void;
}

export const SubmitComplaint: React.FC<SubmitComplaintProps> = ({ onNavigate, onOpenLiveWorkflow }) => {
  const { currentUser } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [building, setBuilding] = useState('Academic Block A');
  const [room, setRoom] = useState('Classroom 204');
  const [selectedCategory, setSelectedCategory] = useState('Equipment Failure');
  const [urgencyContext, setUrgencyContext] = useState('academic_deadline');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live Workflow Modal State
  const [liveWorkflow, setLiveWorkflow] = useState<any | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // Category Cards
  const categories = [
    { id: "Equipment Failure", name: "AV & Smart Classroom", icon: Tv, desc: "Projectors, microphones, podiums, HDMI" },
    { id: "Plumbing Failure", name: "Plumbing & Restroom", icon: Droplet, desc: "Pipe leaks, flush valves, drainage, water supply" },
    { id: "Electrical Failure", name: "Electrical & Lighting", icon: Zap, desc: "Power outage, sparking switches, ceiling fans" },
    { id: "HVAC / Climate Control", name: "HVAC & AC Cooling", icon: Wind, desc: "Split AC breakdown, low cooling, air ducts" },
    { id: "IT & Network Systems", name: "Campus Wi-Fi & IT", icon: Wifi, desc: "Access point dropouts, ethernet ports, LAN" },
    { id: "Civil & Infrastructure", name: "Furniture & Civil", icon: Armchair, desc: "Broken tiered seating, door locks, window glass" }
  ];

  // Buildings
  const buildings = [
    "Academic Block A",
    "Science Complex",
    "Central Library",
    "Turing Computing Complex",
    "Aryabhatta Hall of Residence",
    "Main Auditorium"
  ];

  // Presets
  const presets = [
    {
      label: "Official Demo (Classroom 204 Projector)",
      title: "Projector not working in classroom 204",
      description: "The projector in classroom 204 is not working and we have a presentation tomorrow.",
      building: "Academic Block A",
      room: "Classroom 204",
      category: "Equipment Failure",
      urgency: "academic_deadline"
    },
    {
      label: "Emergency Pipe Burst (Science Block)",
      title: "Water pipe leaking heavily in 2nd floor restroom",
      description: "Pressurized water spraying from the main sink pipe, flooding the floor near corridor electrical panels.",
      building: "Science Block",
      room: "2nd Floor Restroom B",
      category: "Plumbing Failure",
      urgency: "safety_hazard"
    },
    {
      label: "Hazardous Sparks (Library Fan)",
      title: "Ceiling fan regulator sparking and smoking",
      description: "The ceiling fan regulator knob in Study Hall 3 sparks when adjusted and gives off a distinct burning wire smell.",
      building: "Central Library",
      room: "Study Hall 3 (Level 2)",
      category: "Electrical Failure",
      urgency: "safety_hazard"
    },
    {
      label: "Lab Cooling Outage (Turing AC)",
      title: "Split AC unit display blinking error and not cooling",
      description: "The split air conditioning unit in Lab 402 has stopped blowing cold air and makes a loud rattling sound.",
      building: "Turing Computing Complex",
      room: "Lab 402",
      category: "HVAC / Climate Control",
      urgency: "routine"
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setDescription(p.description);
    setBuilding(p.building);
    setRoom(p.room);
    setSelectedCategory(p.category);
    setUrgencyContext(p.urgency);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !description.trim() || !building.trim() || !room.trim()) {
      setError("Please fill in all required fields (Title, Description, Building, Room).");
      return;
    }

    setSubmitting(true);
    setShowWorkflowModal(true);

    try {
      const res = await api.submitComplaint({
        title,
        description,
        building,
        room,
        category: selectedCategory,
        studentName: currentUser.name,
        studentId: currentUser.studentId
      }, false);

      if (!res.success) {
        throw new Error(res.error || "Workflow failed to execute.");
      }

      setLiveWorkflow(res.workflow);
      setCreatedTicketId(res.ticketId);

      if (onOpenLiveWorkflow && res.workflowId) {
        onOpenLiveWorkflow(res.workflowId);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while executing the multi-agent workflow.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-blue-600 font-extrabold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Grievance Submission Studio</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Report a Maintenance Grievance</h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide issue details below. The four collaborating AI agents will autonomously extract diagnostic entities, evaluate academic impact, query past logs, and dispatch work tickets.
        </p>
      </div>

      {/* Preset Quick-Fill Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-3">
          ⚡ 1-Click Demonstration Scenarios (Click to auto-populate):
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-xs group"
            >
              <div className="flex items-center justify-between">
                <p className="font-extrabold text-slate-900 group-hover:text-blue-700">{p.label}</p>
                <span className="text-[10px] text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Select →</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{p.title}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Studio Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* DIVISION 1: Category Tiles */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
              Division 1: Select Affected Infrastructure Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm' 
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="font-extrabold text-xs text-slate-900">{cat.name}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{cat.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DIVISION 2: Campus Coordinates */}
          <div className="pt-6 border-t border-slate-100">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-3">
              Division 2: Campus Coordinates & Facility Location
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus Building <span className="text-red-500">*</span>
                </label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                >
                  {buildings.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Room / Specific Lab / Floor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Classroom 204, Level 2 Restroom"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* DIVISION 3: Problem Statement & Academic Context */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1">
              Division 3: Issue Description & Urgency Context
            </label>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Grievance Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Projector not working in classroom 204"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Detailed Diagnostic Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail symptoms, warning lights, time factors (e.g. presentation tomorrow, scheduled exam)..."
                className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-900 outline-none focus:border-blue-500 leading-relaxed font-medium"
              />
            </div>
          </div>

          {/* DIVISION 4: Student Persona Badge & Dispatch */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900">Reporting as: {currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.studentId} &bull; {currentUser.department}</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Agents Processing...</span>
                </>
              ) : (
                <>
                  <span>Submit & Trigger Multi-Agent Pipeline</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Live Workflow Modal Overlay */}
      {showWorkflowModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 animate-spin-slow" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {submitting ? 'Multi-Agent Autonomous Pipeline In Progress' : 'Ticket Created Successfully!'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {submitting 
                  ? 'Central Coordinator executing Agents 1 through 4 with tool queries...' 
                  : `Official Ticket ${createdTicketId} committed to persistent database.`}
              </p>
            </div>

            <AgentWorkflowVisualizer workflow={liveWorkflow} />

            {!submitting && createdTicketId && (
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setShowWorkflowModal(false);
                    onNavigate('track-complaint', { ticketId: createdTicketId });
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow"
                >
                  <span>Track Ticket {createdTicketId}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setShowWorkflowModal(false);
                    onNavigate('command-center');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                >
                  Inspect in AI Command Center
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
