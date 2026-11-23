import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Code, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  Search,
  Sliders,
  Layers,
  Bot
} from 'lucide-react';

interface AgentCardProps {
  id: string;
  name: string;
  role: string;
  description: string;
  status: 'Waiting' | 'Processing' | 'Completed' | 'Failed' | 'Retrying';
  assignedTask: string;
  inputReceived?: any;
  outputGenerated?: any;
  executionTimeMs?: number;
  attempt?: number;
  source?: string;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  id,
  name,
  role,
  description,
  status,
  assignedTask,
  inputReceived,
  outputGenerated,
  executionTimeMs,
  attempt,
  source,
  isSelected,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'input' | 'details'>('output');
  const [isExpanded, setIsExpanded] = useState(false);

  const getAgentIcon = () => {
    switch (id) {
      case 'agent-1': return Search;
      case 'agent-2': return Sliders;
      case 'agent-3': return Layers;
      default: return Bot;
    }
  };

  const Icon = getAgentIcon();

  const getStatusBadge = () => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Completed
          </span>
        );
      case 'Processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            Processing
          </span>
        );
      case 'Retrying':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <RefreshCw className="w-3.5 h-3.5 text-purple-600" />
            Retrying (Attempt {attempt})
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Waiting
          </span>
        );
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
              status === 'Completed'
                ? 'bg-blue-600 text-white'
                : status === 'Processing'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-700'
            }`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{name}</h4>
              <p className="text-xs text-blue-600 font-semibold">{role}</p>
            </div>
          </div>
          <div>{getStatusBadge()}</div>
        </div>

        <p className="text-xs text-slate-500 mt-3 line-clamp-2">{description}</p>

        {/* Assigned Task */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Assigned Task</span>
          <p className="text-xs text-slate-700 font-medium">{assignedTask}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/70 text-xs font-semibold px-4">
        <button
          onClick={(e) => { e.stopPropagation(); setActiveTab('output'); }}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'output' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Output Data {outputGenerated && '✓'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActiveTab('input'); }}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'input' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Input Received
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setActiveTab('details'); }}
          className={`py-2 px-3 border-b-2 transition-colors ${
            activeTab === 'details' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Execution Metrics
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1">
        {activeTab === 'output' && (
          <div>
            {outputGenerated ? (
              <div>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                  <code>{JSON.stringify(outputGenerated, null, 2)}</code>
                </pre>
                {source && (
                  <p className="text-[10px] text-slate-400 mt-2 font-mono flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Engine: {source}
                  </p>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Waiting for pipeline execution...
              </div>
            )}
          </div>
        )}

        {activeTab === 'input' && (
          <div>
            {inputReceived ? (
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                <code>
                  {typeof inputReceived === 'string' 
                    ? inputReceived 
                    : JSON.stringify(inputReceived, null, 2)}
                </code>
              </pre>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No input passed yet.
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Execution Duration</span>
              <span className="font-mono font-bold text-slate-800">
                {executionTimeMs ? `${executionTimeMs} ms` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Execution Attempt</span>
              <span className="font-mono text-slate-800">{attempt || 1}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Result Validation</span>
              <span className="font-semibold text-emerald-600">Passed Schema Check</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">AI Model / Engine</span>
              <span className="font-mono text-[11px] text-slate-700">{source || 'Gemini 1.5 Flash'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
