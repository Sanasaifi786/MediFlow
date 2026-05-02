import React, { useState, useEffect } from 'react';
import { UserPlus, Search, ShieldCheck, Activity, Download, Loader2, FileText, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api';

const PatientRegistration = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  // Form inputs
  const [form, setForm] = useState({
    name: '',
    age: '',
    disease: '',
    policy_number: ''
  });

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/patients');
      if (res.data.success) {
        setPatients(res.data.patients || []);
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: 'error', message: 'Failed to retrieve patient logs' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.disease) {
      setAlert({ type: 'error', message: 'All required fields must be completed' });
      return;
    }

    try {
      setSubmitting(true);
      setAlert({ type: '', message: '' });
      const res = await api.post('/patients', form);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Patient registered successfully!' });
        setForm({ name: '', age: '', disease: '', policy_number: '' });
        fetchPatients();
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        message: err.response?.data?.message || 'Failed to register the patient. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Reception & Registration</h1>
        <p className="text-slate-500 font-medium">Add arriving patients and manage hospital access credentials.</p>
      </header>

      {alert.message && (
        <div className={`p-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in slide-in-from-top-1 ${
          alert.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-rose-50 text-rose-800 border border-rose-100'
        }`}>
          {alert.type === 'success' ? <ShieldCheck size={20} className="text-emerald-600" /> : <AlertCircle size={20} className="text-rose-600" />}
          {alert.message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Registration Form */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="text-brand-600" size={24} />
            <h2 className="text-lg font-black text-slate-900">Register New Patient</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Patient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Johnathan Doe"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Patient Age</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 45"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Diagnosis / Disease</label>
              <input
                type="text"
                required
                placeholder="e.g. Hypertension"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                value={form.disease}
                onChange={(e) => setForm({ ...form, disease: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Policy Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. PREM-001"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 font-mono transition-all"
                value={form.policy_number}
                onChange={(e) => setForm({ ...form, policy_number: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !form.name || !form.age || !form.disease}
              className="w-full bg-slate-900 text-white p-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Confirm Registration
            </button>
          </form>
        </div>

        {/* Patients List */}
        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-black text-slate-900">Recent Admissions</h2>
            <span className="bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-100 text-slate-500">
              {patients.length} total
            </span>
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm font-bold">
              <Loader2 className="animate-spin text-brand-600" size={36} />
              Retrieving registered logs...
            </div>
          ) : patients.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 text-sm">
              <FileText size={48} className="text-slate-200" />
              <p className="font-bold text-slate-400">No active patient logs yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-xs font-black uppercase text-slate-400 tracking-wider">Patient Info</th>
                    <th className="pb-4 text-xs font-black uppercase text-slate-400 tracking-wider">Diagnosis</th>
                    <th className="pb-4 text-xs font-black uppercase text-slate-400 tracking-wider">Policy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {patients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4">
                        <p className="text-sm font-black text-slate-800">{p.name}</p>
                        <p className="text-xs font-bold text-slate-400 mt-0.5">{p.age} years old</p>
                      </td>
                      <td className="py-4 text-sm font-bold text-slate-600 capitalize">
                        {p.disease}
                      </td>
                      <td className="py-4 text-sm font-mono font-bold text-brand-600">
                        {p.policy_number || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
