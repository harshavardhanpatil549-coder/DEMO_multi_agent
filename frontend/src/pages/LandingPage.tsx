import React, { useState } from 'react';
import { 
  Bot, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Sliders, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Building2, 
  Cpu, 
  TrendingUp, 
  Wrench,
  Users,
  ChevronRight,
  Play,
  GraduationCap,
  Activity,
  Zap,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSystem } from '../context/SystemContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
  onOpenLiveWorkflow?: (workflowId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenLiveWorkflow }) => {
  const { switchRole } = useAuth();
  const { triggerGlobalDemo } = useSystem();
  const [selectedDemo, setSelectedDemo] = useState('official');
  const [isRunning, setIsRunning] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any | null>(null);

  const demoScenarios = [
    {
      id: "official",
      badge: "Official Hackathon Scenario",
      title: "Projector not working in classroom 204",
      desc: "The projector in classroom 204 is not working and we have a presentation tomorrow.",
      location: "Academic Block A, Classroom 204",
      expectedPriority: "High (Presentation Tomorrow)"
    },
    {
      id: "water-leak",
      badge: "Emergency Facility Hazard",
      title: "Water pipe leaking heavily in 2nd floor restroom",
      desc: "Pressurized water spraying from the main sink pipe, flooding the floor near corridor electrical panels.",
      location: "Science Block, Restroom B",
      expectedPriority: "High (Active Flooding Hazard)"
    },
    {
      id: "fan-sparks",
      badge: "Urgent Electrical Fire Hazard",
      title: "Ceiling fan regulator sparking and smoking",
      desc: "The ceiling fan regulator knob in Study Hall 3 sparks when adjusted and gives off a distinct burning wire smell.",
      location: "Central Library, Study Hall 3",
      expectedPriority: "High (Fire / Electrical Hazard)"
    }
  ];

  const handleExecuteLiveDemo = async (scenarioId: string) => {
    setIsRunning(true);
    setDemoOutput(null);
    try {
      const res = await triggerGlobalDemo(scenarioId);
      setDemoOutput(res);
      if (res.workflowId && onOpenLiveWorkflow) {
        onOpenLiveWorkflow(res.workflowId);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* SECTION 1: Hero & Real-Time Autonomous Gateway */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-12 lg:p-16">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/20 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Hackathon Statement: Multi-Agent Autonomy That Gets Real Work Done</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight sm:leading-none">
            Smarter Campus. Faster Solutions. <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Powered by Collaborating AI Agents.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CampusFix AI eliminates manual triage delays. Four specialized agents collaborate to extract technical entities, evaluate academic impact, search past records, and dispatch lead technicians in seconds.
          </p>

          {/* Role Portal Gateway Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                switchRole('student');
                onNavigate('student-dashboard');
              }}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all group"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Enter Student Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                switchRole('staff');
                onNavigate('staff-dashboard');
              }}
              className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all group"
            >
              <Wrench className="w-4 h-4" />
              <span>Enter Staff Field App</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                switchRole('admin');
                onNavigate('admin-dashboard');
              }}
              className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-500/30 flex items-center gap-2 transition-all group"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Enter Admin Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Interactive Multi-Agent Live Simulator Division */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h2 className="text-xl font-extrabold text-slate-900">Live Multi-Agent Test Bench (Judge Playground)</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any real-world campus maintenance grievance and watch the four agents coordinate live on screen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExecuteLiveDemo(selectedDemo)}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>Execute AI Pipeline</span>
            </button>
          </div>
        </div>

        {/* Scenario Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {demoScenarios.map((sc) => {
            const isSelected = selectedDemo === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => setSelectedDemo(sc.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm' 
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                }`}
              >
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 text-slate-700">
                  {sc.badge}
                </span>
                <h4 className="font-bold text-xs text-slate-900 mt-2">{sc.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{sc.desc}</p>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">{sc.location}</span>
                  <span className="font-bold text-red-600">{sc.expectedPriority}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Simulation Output Box */}
        {demoOutput && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 font-mono text-xs animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-sans">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Autonomous Pipeline Execution Succeeded!
              </span>
              <span className="text-xs text-blue-400 font-mono font-bold">
                Ticket: {demoOutput.ticketId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-blue-400 font-bold">Agent 1 (Issue Detection):</p>
                <p className="text-slate-300">Category: {demoOutput.ticket?.category}</p>
                <p className="text-slate-300">Equipment: {demoOutput.ticket?.equipment}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-amber-400 font-bold">Agent 2 (Priority Analysis):</p>
                <p className="text-slate-300">Priority: {demoOutput.ticket?.priority} ({demoOutput.ticket?.urgencyScore}/10)</p>
                <p className="text-slate-400 text-[10px] truncate">{demoOutput.ticket?.priorityReason}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-purple-400 font-bold">Agent 3 (Investigation):</p>
                <p className="text-slate-300">SOP: {demoOutput.ticket?.protocolApplied}</p>
                <p className="text-slate-400 text-[10px] truncate">{demoOutput.ticket?.suggestedAction}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <p className="text-emerald-400 font-bold">Agent 4 (Action & Dispatch):</p>
                <p className="text-slate-300">Dept: {demoOutput.ticket?.assignedDepartment}</p>
                <p className="text-slate-300">Staff Assigned: {demoOutput.ticket?.assignedStaff}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end font-sans">
              <button
                onClick={() => onNavigate('command-center')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <span>Inspect in AI Command Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: The 4 Collaborating AI Agents Architecture Grid */}
      <section className="space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Four Distinct AI Agents</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            GENUINELY separate system instructions, structured schemas, tool lookups, and validation stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              num: "01",
              name: "Issue Detection Agent",
              role: "Entity & Category Extraction",
              icon: Search,
              color: "border-blue-500 text-blue-600",
              desc: "Extracts technical category, affected equipment models, and campus coordinates from unstructured human text."
            },
            {
              num: "02",
              name: "Priority Analysis Agent",
              role: "Academic Urgency Reasoner",
              icon: Sliders,
              color: "border-amber-500 text-amber-600",
              desc: "Objectively scores student impact, upcoming presentation deadlines, and hazard levels. Never defaults everything to High."
            },
            {
              num: "03",
              name: "Investigation Agent",
              role: "Database & KB Tool Forensic",
              icon: Layers,
              color: "border-purple-500 text-purple-600",
              desc: "Executes real tool queries against previous tickets and Campus Knowledge Base protocols (KB-01..KB-06)."
            },
            {
              num: "04",
              name: "Action Agent",
              role: "Dispatch & Persistence Authority",
              icon: Bot,
              color: "border-emerald-500 text-emerald-600",
              desc: "Validates all pipeline outputs, commits ticket CF-2026-XXXX to disk, assigns lead staff, and dispatches alerts."
            }
          ].map((ag, i) => {
            const Icon = ag.icon;
            return (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-slate-50 border flex items-center justify-center ${ag.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xl font-black text-slate-200">{ag.num}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{ag.name}</h3>
                  <p className="text-[11px] font-semibold text-blue-600 mb-2">{ag.role}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{ag.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Structured JSON</span>
                  <span className="text-emerald-600 font-bold">Validated</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
