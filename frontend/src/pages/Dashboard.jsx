import React, { useState, useEffect } from 'react';
import { Activity, Users, Package, FileText, CheckCircle } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const u = JSON.parse(localStorage.getItem('user'));
        setUser(u);
        const token = localStorage.getItem('token');
        const res = await api.get('/auth/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard metrics:", err);
      } finally {
        setLoading(false);
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

        {data.totalClaims !== undefined && (
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

      {/* Render Lists based on role */}
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
    </div>
  );
};

export default Dashboard;
