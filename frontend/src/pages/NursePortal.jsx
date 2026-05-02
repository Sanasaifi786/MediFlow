import React, { useState, useEffect } from 'react';
import { ClipboardList, User, Activity, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api';

const NursePortal = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  const [formData, setFormData] = useState({
    patientId: '',
    type: 'consultation',
    details: ''
  });

  const eventTypes = [
    { value: 'consultation', label: 'General Consultation' },
    { value: 'test', label: 'Diagnostic Test' },
    { value: 'surgery', label: 'Surgical Procedure' },
    { value: 'admission', label: 'Patient Admission' },
    { value: 'discharge', label: 'Patient Discharge' },
  ];

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await api.get('/nurse/patients');
      setPatients(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogEvent = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.details) return;

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/nurse/log-event', formData);
      setStatus({ type: 'success', message: 'Clinical event logged successfully.' });
      setFormData({ ...formData, details: '' }); // Clear only details
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to log event. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-4">
        <Loader2 className="animate-spin text-brand-600" size={40} />
        <p className="text-slate-400 font-bold animate-pulse">Syncing Patient Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4">
          <Activity size={12} />
          Clinical Duty
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Patient Event Logger</h1>
        <p className="text-slate-500 font-medium">Record real-time clinical observations and procedures.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Quick Stats/Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <ClipboardList size={24} />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Protocol Note</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Ensure all vitals and medication administration events are logged immediately for accurate discharge summary generation by AI agents.
            </p>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Active Patients</h4>
            <div className="text-3xl font-black mb-2">{patients.length}</div>
            <p className="text-slate-400 text-xs">Total assigned patients in current ward.</p>
          </div>
        </div>

        {/* Right: Logging Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
            <form onSubmit={handleLogEvent} className="space-y-6">
              {status.message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
                  status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span className="text-sm font-bold">{status.message}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Patient</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium appearance-none"
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    required
                  >
                    <option value="">Choose a patient...</option>
                    {patients.map(p => (
                      <option key={p._id} value={p._id}>{p.name} ({p.age}y - {p.disease})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {eventTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({...formData, type: type.value})}
                      className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                        formData.type === type.value 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                        : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Event Details</label>
                <textarea 
                  placeholder="Enter detailed observations, medicine doses, or procedure notes..."
                  className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-sm font-medium min-h-[150px]"
                  value={formData.details}
                  onChange={(e) => setFormData({...formData, details: e.target.value})}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={submitting || !formData.patientId || !formData.details}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.8rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                Log Clinical Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NursePortal;
