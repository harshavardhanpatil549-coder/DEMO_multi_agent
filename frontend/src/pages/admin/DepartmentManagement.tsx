import React, { useState, useEffect } from 'react';
import { Building2, Users, Clock, ShieldCheck, Mail, Phone, ChevronRight } from 'lucide-react';
import { api } from '../../services/api';
import { Department } from '../../types';

export const DepartmentManagement: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.getDepartments();
        if (res.success) setDepartments(res.departments);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDepts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campus Maintenance Departments</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Autonomous routing targets configured with specialized service level agreements (SLAs) and duty personnel.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div 
            key={dept.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  SLA: {dept.slaHours} Hours
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{dept.name}</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{dept.description}</p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department Lead:</span>
                  <span className="font-semibold text-slate-800">{dept.lead}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Dispatch Email:</span>
                  <span className="font-mono text-blue-600">{dept.contact}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Staff Members</span>
              <div className="flex flex-wrap gap-1.5">
                {dept.staff.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
