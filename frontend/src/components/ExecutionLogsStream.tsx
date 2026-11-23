import React, { useState } from 'react';
import { Terminal, RefreshCw, Filter, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { AgentExecution } from '../types';

interface LogsStreamProps {
  logs: AgentExecution[];
  onRefresh?: () => void;
  isLive?: boolean;
}

export const ExecutionLogsStream: React.FC<LogsStreamProps> = ({ logs, onRefresh, isLive }) => {
  const [filterAgent, setFilterAgent] = useState('all');
  const [search, setSearch] = useState('');

  const filteredLogs = logs.filter(log => {
    if (filterAgent !== 'all' && log.agentName !== filterAgent) return false;
    if (search) {
      const q = search.toLowerCase();
      const str = (log.agentName + ' ' + (log.ticketId || '') + ' ' + (log.errorMessage || '') + ' ' + JSON.stringify(log.output)).toLowerCase();
      if (!str.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 shadow-xl overflow-hidden font-mono text-xs">
      {/* Console Header */}
      <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-100 text-sm">Coordinator & Agent Execution Logs</span>
          {isLive && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE STREAM
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Agent Filter */}
          <select
            value={filterAgent}
            onChange={(e) => setFilterAgent(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1 outline-none focus:border-blue-500"
          >
            <option value="all">All Agents</option>
            <option value="Issue Detection Agent">Issue Detection Agent</option>
            <option value="Priority Analysis Agent">Priority Analysis Agent</option>
            <option value="Investigation Agent">Investigation Agent</option>
            <option value="Action Agent">Action Agent</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Filter logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg pl-6 pr-2 py-1 w-32 focus:w-48 transition-all outline-none focus:border-blue-500"
            />
            <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh logs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Log Entries Container */}
      <div className="p-4 max-h-96 overflow-y-auto space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500">
            No agent executions match current filter.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isSuccess = log.status === 'Completed';
            const time = new Date(log.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            return (
              <div 
                key={log.executionId}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{time}</span>
                    <span className="font-bold text-blue-400">[{log.agentName}]</span>
                    {log.ticketId && (
                      <span className="text-amber-400 text-[10px] bg-amber-400/10 px-1.5 rounded border border-amber-400/20">
                        {log.ticketId}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">
                      {log.durationMs}ms
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isSuccess 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>

                {log.errorMessage ? (
                  <p className="text-red-400 text-[11px] mt-1">Error: {log.errorMessage}</p>
                ) : (
                  <div className="text-slate-300 text-[11px] mt-1 truncate">
                    <span className="text-slate-500">Payload: </span>
                    {JSON.stringify(log.output)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
