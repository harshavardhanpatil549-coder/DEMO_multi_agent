import React from 'react';
import { ArrowRight, Search, Sliders, Layers, Bot, Cpu, CheckCircle2, ShieldCheck, Play } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

interface HowItWorksPageProps {
  onNavigate: (page: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const { triggerGlobalDemo } = useSystem();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="text-center max-w-3xl mx-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">Workflow Blueprint</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">How CampusFix AI Automates Complaint Triage</h1>
        <p className="text-slate-600 mt-2 text-sm leading-relaxed">
          A step-by-step walkthrough of the data flow and agent coordination pipeline.
        </p>
      </div>

      {/* Step by step timeline */}
      <div className="space-y-6">
        {[
          {
            step: "01",
            agent: "Central Coordinator",
            title: "Input Validation & Duplicate Detection",
            desc: "When a student submits a complaint, the Coordinator sanitizes inputs, prevents duplicate submissions within a 30-minute window for the same room, and instantiates an asynchronous workflow record.",
            icon: Cpu,
            color: "border-blue-500 bg-blue-50/30"
          },
          {
            step: "02",
            agent: "Issue Detection Agent",
            title: "Entity Extraction & Categorization",
            desc: "Parses human descriptions to extract the affected equipment (e.g., Optoma projector, flush valve, MCB panel), technical category, exact campus location coordinates, and flags missing information.",
            icon: Search,
            color: "border-cyan-500 bg-cyan-50/30"
          },
          {
            step: "03",
            agent: "Priority Analysis Agent",
            title: "Academic Urgency & Impact Scoring",
            desc: "Evaluates immediate student impact. If presentations, exams, or active safety hazards are scheduled within 24 hours, priority escalates to High. Otherwise, standard or routine priority is assigned with explicit reasoning.",
            icon: Sliders,
            color: "border-amber-500 bg-amber-50/30"
          },
          {
            step: "04",
            agent: "Investigation Agent",
            title: "Live Database & Protocol Tool Lookup",
            desc: "Agent 3 executes real tool queries against the Campus Knowledge Base and past incident records. It matches standard troubleshooting procedures and checks if the equipment had recent recurring faults.",
            icon: Layers,
            color: "border-purple-500 bg-purple-50/30"
          },
          {
            step: "05",
            agent: "Action Agent",
            title: "Ticket Generation & Transaction Commit",
            desc: "Synthesizes all findings, confirms database write, assigns the appropriate lead staff technician, creates ticket CF-2026-XXXX, and dispatches in-app notifications.",
            icon: Bot,
            color: "border-emerald-500 bg-emerald-50/30"
          }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`p-6 rounded-2xl border-l-4 border bg-white shadow-sm flex flex-col sm:flex-row gap-5 items-start ${item.color}`}>
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-base flex-shrink-0">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{item.agent}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={async () => {
            await triggerGlobalDemo('official');
            onNavigate('command-center');
          }}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md inline-flex items-center gap-2 transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch Interactive Demo in Command Center</span>
        </button>
      </div>
    </div>
  );
};
