import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  Play, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Zap, 
  Terminal,
  Server,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { AgentWorkflowVisualizer } from '../../components/AgentWorkflowVisualizer';
import { AgentCard } from '../../components/AgentCard';
import { ExecutionLogsStream } from '../../components/ExecutionLogsStream';
import { AgentExecution, WorkflowLog } from '../../types';

interface CommandCenterProps {
  onNavigate?: (page: string, params?: any) => void;
  activeWorkflowId?: string | null;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onNavigate, activeWorkflowId }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string>('Issue Detection Agent');
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [liveWorkflow, setLiveWorkflow] = useState<WorkflowLog | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.getCommandCenter();
      if (res.success) {
        setData(res);
        if (!liveWorkflow && res.latestWorkflow) {
          setLiveWorkflow(res.latestWorkflow);
        }
      }
    } catch (e) {
      console.error("Failed to load command center data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  // If activeWorkflowId is passed, track it
  useEffect(() => {
    if (activeWorkflowId) {
      const poll = async () => {
        try {
          const res = await api.getWorkflowStatus(activeWorkflowId);
          if (res.success) {
            setLiveWorkflow(res.workflow);
          }
        } catch (e) {}
      };
      poll();
      const interval = setInterval(poll, 1500);
      return () => clearInterval(interval);
    }
  }, [activeWorkflowId]);

  const handleRunScenario = async (scenarioKey: string) => {
    setRunningScenario(scenarioKey);
    try {
      const res = await api.triggerDemoScenario(scenarioKey, false);
      if (res.success) {
        setLiveWorkflow(res.workflow);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunningScenario(null);
    }
  };

  const coordinator = data?.coordinator;
  const agents = data?.agents || [];
  const executions = data?.recentExecutions || [];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-3">
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span>Multi-Agent Autonomous Orchestration</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">AI Agent Command Center</h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Supervise the Central Coordinator and inspect the live execution lifecycle, reasoning, inputs, outputs, and database writes across all four specialized agents.
            </p>
          </div>

          {/* Quick Scenario Triggers */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleRunScenario('official')}
              disabled={Boolean(runningScenario)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {runningScenario === 'official' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current text-white" />
              )}
              <span>Run Official Demo (Classroom 204)</span>
            </button>

            <button
              onClick={() => handleRunScenario('water-leak')}
              disabled={Boolean(runningScenario)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <span>Test: Water Leak</span>
            </button>

            <button
              onClick={() => handleRunScenario('fan-sparks')}
              disabled={Boolean(runningScenario)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <span>Test: Electrical Sparks</span>
            </button>
          </div>
        </div>

        {/* Coordinator Metric Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Coordinator Status</span>
            <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {coordinator?.status || 'Online / Ready'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">AI Engine</span>
            <span className="text-blue-300 font-bold text-sm mt-0.5 block truncate">
              {coordinator?.aiProvider?.model || 'Gemini 1.5 Flash'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">Storage Mode</span>
            <span className="text-amber-300 font-bold text-sm mt-0.5 block truncate">
              {coordinator?.storageProvider?.mode || 'Disk Persisted DB'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px]">Total Workflows Executed</span>
            <span className="text-white font-bold text-sm mt-0.5 block">
              {coordinator?.totalWorkflows || 1} workflows
            </span>
          </div>
        </div>
      </div>

      {/* Visual Workflow Pipeline Flowchart */}
      <AgentWorkflowVisualizer 
        workflow={liveWorkflow}
        onSelectAgent={(name) => setSelectedAgent(name)}
        selectedAgent={selectedAgent}
      />

      {/* Active Workflow Task Details (if present) */}
      {liveWorkflow && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Active Workflow Task:</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                "{liveWorkflow.complaint?.title}" &bull; {liveWorkflow.complaint?.building} ({liveWorkflow.complaint?.room})
              </h4>
            </div>
            {liveWorkflow.ticketId && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">Generated Ticket:</span>
                <button
                  onClick={() => onNavigate && onNavigate('track-complaint', { ticketId: liveWorkflow.ticketId })}
                  className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors flex items-center gap-1"
                >
                  <span>{liveWorkflow.ticketId}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-600 mt-2">
            <span className="font-semibold text-slate-700">Current Step: </span>
            {liveWorkflow.currentStep}
          </p>
        </div>
      )}

      {/* Four AI Agent Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Specialized AI Agents (4 Collaborating Nodes)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any card to inspect structured input/output JSON schemas and execution metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agents.map((ag: any) => {
            // Determine active data from liveWorkflow
            const agentKey = ag.name;
            const workflowAgent = liveWorkflow?.agents?.[agentKey];
            const executionLog = executions.find((e: AgentExecution) => e.agentName === agentKey);
            
            const currentStatus = workflowAgent?.status || ag.status || 'Waiting';
            const output = workflowAgent?.output || executionLog?.output || null;
            const duration = workflowAgent?.durationMs || executionLog?.durationMs || ag.stats?.avgTimeMs;

            return (
              <AgentCard
                key={ag.id}
                id={ag.id}
                name={ag.name}
                role={ag.role}
                description={ag.description}
                status={currentStatus}
                assignedTask={
                  ag.id === 'agent-1' 
                    ? 'Analyze complaint text, extract category, affected equipment, and location coordinates.'
                    : ag.id === 'agent-2'
                    ? 'Evaluate academic urgency (presentations, exams tomorrow), student impact, and assign Low/Med/High priority.'
                    : ag.id === 'agent-3'
                    ? 'Query Knowledge Base protocols (KB-01..KB-06) and historical tickets for matching repair procedures.'
                    : 'Validate multi-agent schema outputs, generate CF-2026-XXXX ticket, commit to disk, and dispatch.'
                }
                inputReceived={executionLog?.input || 'Inputs passed from preceding stage'}
                outputGenerated={output}
                executionTimeMs={duration}
                attempt={executionLog?.attempt || 1}
                source={executionLog?.source || 'Gemini 1.5 Flash (Structured JSON)'}
                isSelected={selectedAgent === ag.name}
                onSelect={() => setSelectedAgent(ag.name)}
              />
            );
          })}
        </div>
      </div>

      {/* Real-time Execution Logs Stream Panel */}
      <ExecutionLogsStream 
        logs={executions}
        onRefresh={fetchData}
        isLive={true}
      />
    </div>
  );
};
