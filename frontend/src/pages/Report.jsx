import React, { useState } from 'react';
import { Search, FileText, UserCircle, Activity, Download, Loader2, Sparkles } from 'lucide-react';
import api from '../api';

const Report = () => {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);   // { name, disease, events[] }
  const [summaries, setSummaries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState('');

  const searchPatient = async (e) => {
    e.preventDefault();
    if (!patientId.trim()) return;

    setLoading(true);
    setError('');
    setPatientData(null);
    setSummaries(null);

    try {
      // Fetch patient by patient_id, name, or mongo ObjectId via the discharge endpoint
      // First look up the patient directly from /patients
      const patientsRes = await api.get('/patients');
      const allPatients = patientsRes.data.patients || [];

      // Match by patient_id string or name
      const match = allPatients.find(
        (p) =>
          p.patient_id?.toLowerCase() === patientId.toLowerCase() ||
          p.name?.toLowerCase() === patientId.toLowerCase() ||
          p._id === patientId
      );

      if (!match) {
        setError(`No patient found for "${patientId}". Try PAT-1001, PAT-1002, or a patient name.`);
        return;
      }

      // Fetch patient events from nurse events — using brain's discharge timeline approach
      // The dischargeAgent/timelineExtractionTool already supports patient_id lookups
      const dischargeRes = await api.post('/discharge/generate', { patientId: match.patient_id || match._id });
      const data = dischargeRes.data;

      // Build timeline from real events if returned, else from patient data
      const events = (data.events || []).map((ev, idx) => ({
        id: idx + 1,
        type: ev.type ? ev.type.charAt(0).toUpperCase() + ev.type.slice(1) : 'Event',
        details: ev.details,
        time: new Date(ev.timestamp).toLocaleString()
      }));

      // If no events array in response, build a minimal timeline from patient info
      const timeline = events.length > 0 ? events : [
        {
          id: 1,
          type: 'Admission',
          details: `Patient ${match.name} admitted. Diagnosis: ${match.disease}.`,
          time: new Date(match.createdAt).toLocaleString()
        }
      ];

      setPatientData({
        name: match.name,
        disease: match.disease,
        patient_id: match.patient_id,
        timeline,
        dischargeResult: data
      });

      // If discharge already returned summaries, pre-populate
      if (data?.summaries?.clinicalSummary) {
        setSummaries({
          doctor: data.summaries.clinicalSummary,
          patient: data.summaries.patientSummary
        });
      }

    } catch (err) {
      console.error(err);
      setError('Failed to retrieve patient data. Please check the Patient ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await api.post('/discharge/generate', {
        patientId: patientData?.patient_id || patientId
      });
      setSummaries({
        doctor: res.data.summaries?.clinicalSummary || 'No clinical summary returned.',
        patient: res.data.summaries?.patientSummary || 'No patient summary returned.'
      });
    } catch (err) {
      console.error(err);
      setSummaries({
        doctor: 'Failed to generate clinical summary. Please try again.',
        patient: 'Failed to generate patient summary.'
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Report Engine</h1>
        <p className="text-slate-500 font-medium">Fetch live patient timelines and generate AI-powered discharge summaries.</p>
      </header>

      {/* Patient Search */}
      <form onSubmit={searchPatient} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Enter Patient ID (e.g. PAT-1001) or Name..."
            className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !patientId.trim()}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
          {loading ? 'Fetching...' : 'Fetch Timeline'}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 font-bold text-sm px-6 py-4 rounded-2xl animate-in slide-in-from-top-2">
          {error}
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
          <Loader2 className="animate-spin text-brand-600" size={48} />
          <p className="font-bold text-base tracking-wide">Retrieving patient timeline...</p>
        </div>
      )}

      {/* Timeline + Summaries */}
      {!loading && patientData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-500">
          {/* Timeline View */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-black text-slate-900 text-lg">{patientData.name}</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{patientData.patient_id} · {patientData.disease}</p>
              </div>
              <Activity className="text-brand-500" size={20} />
            </div>

            <div className="h-px bg-slate-100 my-6" />

            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
              {patientData.timeline.map((event) => (
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
              disabled={summaryLoading}
              className="w-full mt-10 py-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-100 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {summaryLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {summaryLoading ? 'Generating...' : 'Generate Summaries'}
            </button>
          </div>

          {/* Summaries Area */}
          <div className="lg:col-span-7">
            {summaryLoading && (
              <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-slate-400">
                <Loader2 className="animate-spin text-brand-600" size={48} />
                <p className="font-bold text-base">AI is generating summaries...</p>
              </div>
            )}

            {!summaryLoading && summaries ? (
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
            ) : !summaryLoading && (
              <div className="h-full bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center min-h-[400px]">
                <FileText size={64} className="text-slate-200 mb-4" />
                <h4 className="font-bold text-slate-400 mb-2">Awaiting Generation</h4>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  Click "Generate Summaries" to create AI-powered discharge notes for this patient.
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
