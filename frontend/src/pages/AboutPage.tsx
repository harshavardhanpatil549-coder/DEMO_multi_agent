import React from 'react';
import { Bot, Shield, CheckCircle2, Users, Cpu, Server, Database, Globe } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">About CampusFix AI</span>
        <h1 className="text-3xl font-extrabold text-slate-900 mt-3">Re-Architecting Campus Maintenance with Multi-Agent Autonomy</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          CampusFix AI was engineered to bridge the critical gap between student grievances and immediate campus maintenance actions. By employing four specialized AI agents orchestrated by a Central Coordinator, the system converts ambiguous human complaints into validated, prioritized, and actionable technical tickets within seconds.
        </p>
      </div>

      {/* Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">True Multi-Agent Design</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Unlike monolithic chatbots, each agent possesses dedicated system instructions, bounded responsibilities, structured JSON schemas, and error retry states.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Grounding with Tools</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Investigation Agent executes real database and knowledge base searches over past campus incident logs rather than guessing answers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 mb-1">Auditability & Verification</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every step is recorded in immutable execution logs. Physical ticket closure requires verification from staff and administration.
          </p>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Technology Stack</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">Frontend</span>
            <p className="font-semibold text-slate-800">React 18 + TypeScript</p>
            <p className="text-slate-500">Tailwind CSS & Lucide</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">Backend</span>
            <p className="font-semibold text-slate-800">Node.js + Express</p>
            <p className="text-slate-500">REST APIs & Async State</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">AI Engine</span>
            <p className="font-semibold text-slate-800">Google Gemini API</p>
            <p className="text-slate-500">Structured JSON Outputs</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">Storage</span>
            <p className="font-semibold text-slate-800">Firestore & Local DB</p>
            <p className="text-slate-500">Persistent Disk Storage</p>
          </div>
        </div>
      </div>
    </div>
  );
};
