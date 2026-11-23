import React from 'react';
import { 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Cpu,
  FileCheck,
  Search,
  Sliders,
  Send
} from 'lucide-react';
import { WorkflowLog } from '../types';

interface WorkflowVisualizerProps {
  workflow: WorkflowLog | null;
  onSelectAgent?: (agentName: string) => void;
  selectedAgent?: string;
}

export const AgentWorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  workflow,
  onSelectAgent,
  selectedAgent
}) => {
  const steps = [
    {
      id: 'step-0',
      name: 'Student Complaint',
      role: 'User Submission',
      icon: Send,
      status: workflow ? 'Completed' : 'Waiting',
      time: null
    },
    {
      id: 'step-coord',
      name: 'Central Coordinator',
      role: 'Task Orchestrator',
      icon: Cpu,
      status: workflow ? (workflow.coordinatorStatus === 'Running' ? 'Processing' : workflow.coordinatorStatus) : 'Waiting',
      time: null
    },
    {
      id: 'agent-1',
      agentKey: 'Issue Detection Agent',
      name: 'Agent 1: Detection',
      role: 'Category & Entity',
      icon: Search,
      status: workflow?.agents?.['Issue Detection Agent']?.status || 'Waiting',
      time: workflow?.agents?.['Issue Detection Agent']?.durationMs
    },
    {
      id: 'agent-2',
      agentKey: 'Priority Analysis Agent',
      name: 'Agent 2: Priority',
      role: 'Urgency & Impact',
      icon: Sliders,
      status: workflow?.agents?.['Priority Analysis Agent']?.status || 'Waiting',
      time: workflow?.agents?.['Priority Analysis Agent']?.durationMs
    },
    {
      id: 'agent-3',
      agentKey: 'Investigation Agent',
      name: 'Agent 3: Investigation',
      role: 'KB & DB Forensic',
      icon: Layers,
      status: workflow?.agents?.['Investigation Agent']?.status || 'Waiting',
      time: workflow?.agents?.['Investigation Agent']?.durationMs
    },
    {
      id: 'agent-4',
      agentKey: 'Action Agent',
      name: 'Agent 4: Action',
      role: 'Dispatch & Persistence',
      icon: Bot,
      status: workflow?.agents?.['Action Agent']?.status || 'Waiting',
      time: workflow?.agents?.['Action Agent']?.durationMs
    },
    {
      id: 'step-ticket',
      name: 'Ticket Created',
      role: workflow?.ticketId ? workflow.ticketId : 'Final Destination',
      icon: FileCheck,
      status: workflow?.ticketId ? 'Completed' : 'Waiting',
      time: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"><CheckCircle2 className="w-3 h-3" /> Done</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse"><RefreshCw className="w-3 h-3 animate-spin" /> Active</span>;
      case 'Retrying':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200"><RefreshCw className="w-3 h-3" /> Retrying</span>;
      case 'Failed':
        return <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200"><AlertCircle className="w-3 h-3" /> Failed</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> Waiting</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h3 className="font-bold text-slate-900 text-base">Autonomous Multi-Agent Pipeline</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Event-driven pipeline orchestrated by Central AI Coordinator
          </p>
        </div>
        {workflow && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-slate-500 font-mono">Workflow ID:</span>
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {workflow.workflowId}
            </span>
          </div>
        )}
      </div>

      {/* Visual Pipeline Flow */}
      <div className="pt-6 pb-2 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[760px] gap-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isClickable = Boolean(step.agentKey && onSelectAgent);
            const isSelected = selectedAgent === step.agentKey;
            const isProcessing = step.status === 'Processing';

            return (
              <React.Fragment key={step.id}>
                <div 
                  onClick={() => isClickable && onSelectAgent!(step.agentKey!)}
                  className={`flex-1 flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-md scale-105' 
                      : isProcessing
                      ? 'border-amber-400 bg-amber-50/40 shadow-sm animate-pulse'
                      : step.status === 'Completed'
                      ? 'border-emerald-200 bg-emerald-50/20 hover:border-slate-300'
                      : 'border-slate-200 bg-slate-50/60 opacity-75'
                  } ${isClickable ? 'cursor-pointer hover:shadow-sm' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 shadow-sm ${
                    step.status === 'Completed'
                      ? 'bg-emerald-600 text-white'
                      : isProcessing
                      ? 'bg-amber-500 text-white animate-spin-slow'
                      : step.status === 'Failed'
                      ? 'bg-red-500 text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <p className="font-bold text-xs text-slate-900 leading-tight truncate w-full px-1">
                    {step.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate w-full mt-0.5">
                    {step.role}
                  </p>

                  <div className="mt-2">
                    {getStatusBadge(step.status)}
                  </div>

                  {step.time && (
                    <span className="text-[10px] font-mono text-slate-500 mt-1">
                      {step.time} ms
                    </span>
                  )}
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-shrink-0 text-slate-300 px-0.5">
                    <ArrowRight className={`w-4 h-4 ${
                      step.status === 'Completed' ? 'text-emerald-500' : 'text-slate-300'
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
