import React, { useState, useEffect } from 'react';
import { Activity, Users, Package, FileText, CheckCircle, RefreshCcw, ClipboardList } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
        const res = await api.get('/auth/dashboard');
        setData(res.data);

        if (res.data && res.data.role === 'insurance_manager') {
          fetchPolicies();
        }
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchPolicies = async () => {
      try {
        setPoliciesLoading(true);
        const res = await api.get('/insurance/all');
        if (res.data.success) {
          setPolicies(res.data.policies || []);
        }
      } catch (err) {
        console.error('Failed to fetch policies on dashboard:', err);
      } finally {
        setPoliciesLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-rose-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pt-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 capitalize">{data.role} Dashboard</h1>
        <p className="text-slate-500 mt-2">{data.message || data.recentActivity || "Welcome to your portal."}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.totalEmployees !== undefined && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Total Employees</p>
              <h3 className="text-2xl font-black text-slate-800">{data.totalEmployees}</h3>
            </div>
          </div>
        )}

        {data.totalPatients !== undefined && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Total Patients</p>
              <h3 className="text-2xl font-black text-slate-800">{data.totalPatients}</h3>
            </div>
          </div>
        )}

        {data.systemStatus && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">System Status</p>
              <h3 className="text-xl font-bold text-emerald-600">{data.systemStatus}</h3>
            </div>
          </div>
        )}

        {data.lowStockMedicines !== undefined && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Low Stock Alerts</p>
              <h3 className="text-2xl font-black text-rose-600">{data.lowStockMedicines.length}</h3>
            </div>
          </div>
        )}

        {/* Removed Total Claims card for the insurance_manager as requested */}
        {data.role !== 'insurance_manager' && data.totalClaims !== undefined && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Total Claims</p>
              <h3 className="text-2xl font-black text-slate-800">{data.totalClaims}</h3>
            </div>
          </div>
        )}

        {data.totalEventsRecorded !== undefined && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase">Events Logged</p>
              <h3 className="text-2xl font-black text-slate-800">{data.totalEventsRecorded}</h3>
            </div>
          </div>
        )}
      </div>

      {/* Render Table of Active Policies for Insurance Manager */}
      {data.role === 'insurance_manager' && (
        <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800">Available Active Policies</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-600 border border-brand-100">
              {policies.length} Policies
            </span>
          </div>
          {policiesLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : policies.length === 0 ? (
            <p className="text-slate-400 text-sm italic">No active insurance policies found in the database.</p>
          ) : (
            <div className="overflow-x-auto border border-slate-50 rounded-2xl">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">Patient</th>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">Type</th>
                    <th className="px-4 py-3 text-xs font-black uppercase text-slate-400">Policy Number</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {policies.map((p) => (
                    <tr key={p._id} className="text-sm font-medium hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-bold text-slate-800">{p.patient_id?.name || 'N/A'}</td>
                      <td className="px-4 py-3 capitalize">{p.policy_type || 'standard'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-brand-600 font-bold bg-brand-50/30 px-2.5 py-1 rounded-xl w-fit">
                        {p.policy_number || p._id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Render Lists based on other roles */}
      {data.recentConsultations && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Consultations</h3>
          <ul className="space-y-3">
            {data.recentConsultations.map((c, i) => (
              <li key={i} className="p-3 bg-slate-50 rounded-xl text-sm text-slate-700">
                {c.details || 'Consultation record'}
              </li>
            ))}
            {data.recentConsultations.length === 0 && <p className="text-slate-400">No recent consultations.</p>}
          </ul>
        </div>
      )}

      {data.lowStockMedicines && data.lowStockMedicines.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
          <h3 className="text-lg font-bold text-rose-600 mb-4">Critical Inventory</h3>
          <ul className="space-y-3">
            {data.lowStockMedicines.map((m, i) => (
              <li key={i} className="p-3 bg-rose-50 rounded-xl text-sm text-rose-800 flex justify-between">
                <span className="font-bold">{m.name}</span>
                <span>Stock: {m.current_stock} / {m.threshold}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.recentActivityLog && (
        <div className="mt-12 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ClipboardList size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Your Recent Activity Log</h3>
          </div>
          <div className="space-y-4">
            {data.recentActivityLog.map((log, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-[1.8rem] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></div>
                  <div>
                    <p className="font-black text-slate-900">{log.patient_id?.name || 'Internal Patient'}</p>
                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{log.type}</p>
                  </div>
                </div>
                <div className="flex-1 md:px-8">
                  <p className="text-sm text-slate-500 italic leading-relaxed">"{log.details}"</p>
                </div>
                <div className="text-[10px] font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                  {new Date(log.timestamp || log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            {data.recentActivityLog.length === 0 && (
              <div className="text-center py-12 text-slate-400 italic">No activity recorded in the current shift.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
