import React, { useState, useEffect } from 'react';
import { BookOpen, Search, PlusCircle, Layers, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { KnowledgeBaseItem } from '../../types';

export const KnowledgeBasePage: React.FC = () => {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Protocol Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AV Equipment');
  const [dept, setDept] = useState('AV Maintenance');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [keywords, setKeywords] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchKB = async () => {
    setLoading(true);
    try {
      const res = await api.getKnowledgeBase(search);
      if (res.success) setItems(res.knowledgeBase);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKB();
  }, [search]);

  const handleCreateProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.createKnowledgeBaseItem({
        title,
        category,
        responsibleDepartment: dept,
        description,
        troubleshootingSteps: steps,
        keywords
      });
      if (res.success) {
        setShowAddModal(false);
        setTitle('');
        setDescription('');
        setSteps('');
        setKeywords('');
        fetchKB();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Maintenance Knowledge Base</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Standard troubleshooting protocols queried directly by the Investigation Agent during autonomous analysis.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Standard Protocol</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search standard protocols (e.g. projector, circuit breaker, water leak, wifi)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Protocols List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">Loading knowledge base protocols...</div>
        ) : items.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-500">No matching protocols found.</div>
        ) : (
          items.map((kb) => (
            <div 
              key={kb.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
                    {kb.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {kb.responsibleDepartment}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{kb.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{kb.description}</p>

                {/* Steps */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Verified Troubleshooting Steps:
                  </span>
                  <div className="space-y-1.5 text-xs text-slate-700 font-mono">
                    {kb.troubleshootingSteps.map((step, idx) => (
                      <p key={idx} className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Keywords Tagging */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Agent Keywords:</span>
                {kb.keywords.map((kw, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Protocol Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Standard Protocol</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProtocol} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Protocol Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Elevators & Lift Emergency Diagnostic"
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Responsible Dept</label>
                  <input
                    type="text"
                    required
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Protocol Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of this SOP..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Troubleshooting Steps (One per line)</label>
                <textarea
                  rows={4}
                  required
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="1. Step one...&#10;2. Step two...&#10;3. Step three..."
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Matching Keywords (Comma-separated)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="lift, elevator, hoist, door lock"
                  className="w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Register Protocol</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
