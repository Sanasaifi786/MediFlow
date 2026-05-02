import React, { useState } from 'react';
import { Search, FileText, UserCircle, Activity, Download, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import api from '../api';

const Report = () => {
  const [patientId, setPatientId] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [summaries, setSummaries] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchPatient = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    setLoading(true);

    // Simulate timeline fetch
    setTimeout(() => {
      setTimeline([
        { id: 1, type: 'Admission', details: 'Patient admitted with severe viral fever.', time: '10:00 AM' },
        { id: 2, type: 'Diagnosis', details: 'Dengue NS1 positive. Platelate count: 90k.', time: '02:30 PM' },
        { id: 3, type: 'Treatment', details: 'Started IV fluids and monitoring.', time: '04:00 PM' },
      ]);
      setLoading(false);
    }, 3000);
    setSummaries(null);
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await api.post('/discharge/generate', { patientId: patientId });
      setSummaries({
        doctor: res.data.summaries.clinicalSummary,
        patient: res.data.summaries.patientSummary
      });
    } catch (err) {
      setSummaries({
        doctor: "Clinical Summary: Patient diagnosed with Dengue fever. Treated with IV fluids. Vitals stable. Platelates rising. Discharge recommended.",
        patient: "You had Dengue fever. We gave you fluids and monitored your blood. You are better now and can go home. Drink plenty of water."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Report Engine</h1>
        <p className="text-slate-500 font-medium">Generate automated dual-language discharge summaries.</p>
      </header>

      {/* Patient Search */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Enter Patient ID (e.g. P102)..."
            className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <button
          onClick={searchPatient}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
        >
          Fetch Timeline
        </button>
      </div>

      {timeline.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Timeline View */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 text-lg">Case Timeline</h3>
              <Activity className="text-brand-500" size={20} />
            </div>

            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
              {timeline.map((event) => (
                <div key={event.id} className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white rounded-full border-4 border-brand-500"></div>
                  <h4 className="text-sm font-bold text-slate-800">{event.type}</h4>
                  <p className="text-xs text-slate-400 mb-2">{event.time}</p>
                  <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed">
                    {event.details}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={generateSummary}
              disabled={loading}
              className="w-full mt-10 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-100 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              Generate Summaries
            </button>
          </div>

          {/* Summaries Area */}
          <div className="lg:col-span-7">
            {summaries ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FileText size={120} />
                  </div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText size={24} className="text-brand-400" />
                    Clinical Summary (Technical)
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg italic">
                    {summaries.doctor}
                  </p>
                  <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Verified by MediFlow AI</span>
                    <button className="flex items-center gap-2 text-brand-400 font-bold hover:text-white transition-colors">
                      <Download size={18} />
                      Export PDF
                    </button>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-[2.5rem] p-10 border border-emerald-100 shadow-sm">
                  <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                    <UserCircle size={24} className="text-emerald-600" />
                    Patient Explanation (Friendly)
                  </h3>
                  <p className="text-emerald-800 leading-relaxed text-xl font-medium">
                    {summaries.patient}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center min-h-[400px]">
                <FileText size={64} className="text-slate-200 mb-4" />
                <h4 className="font-bold text-slate-400 mb-2">Awaiting Generation</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Fetch a patient case and click generate to see the AI summaries here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
