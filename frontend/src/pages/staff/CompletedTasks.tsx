import React, { useState, useEffect } from 'react';
import { CheckCircle2, Search, RefreshCw, ChevronRight, Building } from 'lucide-react';
import { api } from '../../services/api';
import { Complaint } from '../../types';

export const CompletedTasks: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.getComplaints();
        if (res.success) {
          setComplaints(res.complaints.filter((c: Complaint) => c.status === 'Completed' || c.status === 'Resolved'));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCompleted();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Completed Maintenance Tasks</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          History of tasks completed by maintenance technicians and verified by campus administration.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading completed tasks...</div>
        ) : complaints.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">No completed tasks yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div key={c.ticketId} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {c.ticketId}
                    </span>
                    <span className="text-xs font-bold text-slate-800">&bull; {c.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{c.location} &bull; Dept: {c.assignedDepartment}</p>
                  <p className="text-xs text-emerald-700 mt-1">
                    <span className="font-bold">Suggested Action Applied: </span>{c.suggestedAction}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                    c.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{c.status === 'Resolved' ? 'Verified Resolved' : 'Completed (Pending Admin)'}</span>
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Staff: {c.assignedStaff || 'Assigned Specialist'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
