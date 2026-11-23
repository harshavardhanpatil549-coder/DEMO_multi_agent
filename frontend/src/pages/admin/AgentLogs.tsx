import React, { useState, useEffect } from 'react';
import { Terminal, RefreshCw, Search, Filter, ShieldAlert, CheckCircle2, ChevronDown } from 'lucide-react';
import { api } from '../../services/api';
import { AgentExecution } from '../../types';

export const AgentLogs: React.FC = () => {
  const [logs, setLogs] = useState<AgentExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AgentExecution | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAgentExecutions();
      if (res.success) setLogs(res.executions);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => {
    if (search) {
      const q = search.toLowerCase();
      return (
        l.agentName.toLowerCase().includes(q) ||
        (l.ticketId || '').toLowerCase().includes(q) ||
        (l.errorMessage || '').toLowerCase().includes(q) ||
        JSON.stringify(l.output).toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Agent Execution Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable system logs capturing agent invocations, timestamps, JSON payloads, and validation statuses.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter execution logs by ticket ID, agent, or error keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 overflow-hidden font-mono text-xs shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500">Loading execution records...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500">No execution logs found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Agent Name</th>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filtered.map((l) => (
                  <tr key={l.executionId} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(l.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-400">{l.agentName}</td>
                    <td className="py-3 px-4 text-amber-400">{l.ticketId || 'In Pipeline'}</td>
                    <td className="py-3 px-4 text-slate-400">{l.durationMs}ms</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'Completed' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedLog(l)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-sans text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 max-h-[85vh] overflow-y-auto space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-sans">
              <div>
                <h3 className="font-bold text-white text-base">{selectedLog.agentName}</h3>
                <p className="text-xs text-slate-400">{selectedLog.executionId}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Duration</span>
                <span className="font-mono text-white">{selectedLog.durationMs} ms</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Engine / Provider</span>
                <span className="font-mono text-white">{selectedLog.source || 'Google Gemini API'}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-400 block mb-1">Generated Output Schema:</span>
              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-emerald-400">
                <code>{JSON.stringify(selectedLog.output, null, 2)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
