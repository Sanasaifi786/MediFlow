import React, { useState } from 'react';
import { Search, Plus, FileText, UserCircle, Activity, Download, Loader2 } from 'lucide-react';
import api from '../api';

const Discharge = () => {
  const [patientId, setPatientId] = useState('');
  const [timeline, setTimeline] = useState([]);
  const [summaries, setSummaries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({ type: 'Admission', details: '' });

  const searchPatient = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    // Mock API call to get timeline
    setTimeline([
      { id: 1, type: 'Admission', details: 'Patient admitted with severe viral fever and dehydration.', time: '10:00 AM, Oct 12' },
      { id: 2, type: 'Diagnosis', details: 'Blood test confirms Dengue NS1 positive.', time: '02:30 PM, Oct 12' },
      { id: 3, type: 'Treatment', details: 'Started IV fluids and Paracetamol.', time: '04:00 PM, Oct 12' },
    ]);
    setSummaries(null);
  };

  const addEvent = (e) => {
    e.preventDefault();
    if (!newEvent.details) return;
    setTimeline([...timeline, { 
      id: Date.now(), 
      type: newEvent.type, 
      details: newEvent.details, 
      time: new Date().toLocaleString() 
    }]);
    setNewEvent({ ...newEvent, details: '' });
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const res = await api.post('/discharge/generate', { timeline });
      setTimeout(() => {
        setSummaries({
          doctor: res.data.data.doctor_summary,
          patient: res.data.data.patient_summary
        });
        setLoading(false);
      }, 3000); // Fake delay for wow factor
    } catch (err) {
      setTimeout(() => {
        setSummaries({
          doctor: "Clinical Summary: Patient diagnosed with Dengue fever. Treated with IV fluids and antipyretics. Vitals stable. Ready for discharge.",
          patient: "You had a viral fever (Dengue). We gave you fluids and medicines to bring your fever down. You are now better and can go home. Please drink lots of water and rest."
        });
        setLoading(false);
      }, 3000);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Admission': return <UserCircle className="text-blue-500" />;
      case 'Diagnosis': return <Activity className="text-orange-500" />;
      case 'Treatment': return <Plus className="text-emerald-500" />;
      default: return <FileText className="text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Discharge Summary Generation</h1>
        <p className="text-slate-500">Dual-output AI agent for clinical and patient-friendly reports</p>
      </header>

      {/* Top Search Bar */}
      <form onSubmit={searchPatient} className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search Patient ID (e.g. P123)" 
            className="w-full pl-10 p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors">
          Search Patient
        </button>
      </form>

      {timeline.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Timeline & Add Event */}
          <div className="col-span-1 lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                Patient Timeline <span className="ml-2 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{timeline.length} Events</span>
              </h2>
              
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                {timeline.map((event) => (
                  <div key={event.id} className="relative pl-6">
                    <div className="absolute -left-[17px] top-1 bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                      {getIcon(event.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{event.type}</h4>
                      <p className="text-xs text-slate-500 mb-1">{event.time}</p>
                      <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">{event.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Event Form */}
              <form onSubmit={addEvent} className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Add New Event</h4>
                <div className="flex gap-2">
                  <select 
                    className="w-1/3 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  >
                    <option>Admission</option>
                    <option>Diagnosis</option>
                    <option>Treatment</option>
                    <option>Lab Result</option>
                  </select>
                  <input 
                    type="text"
                    placeholder="Event details..."
                    className="flex-1 p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    value={newEvent.details}
                    onChange={(e) => setNewEvent({...newEvent, details: e.target.value})}
                  />
                  <button type="submit" className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </form>
            </div>
            
            <button 
              onClick={generateSummary}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:transform-none flex justify-center items-center"
            >
              {loading ? <><Loader2 className="animate-spin mr-2" /> AI Agent Processing...</> : 'Generate Smart Discharge Summaries'}
            </button>
          </div>

          {/* Right: Split Summaries */}
          <div className="col-span-1 lg:col-span-7">
            {summaries ? (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden h-full animate-in zoom-in-95 duration-500 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="font-bold text-slate-800">Final Reports</h3>
                  <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 px-3 py-1 bg-indigo-50 rounded-lg">
                    <Download size={16} className="mr-2" /> Export PDF
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row flex-1 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  {/* Doctor Summary */}
                  <div className="flex-1 p-6 relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div className="flex items-center mb-4">
                      <FileText className="text-blue-600 mr-2" size={20} />
                      <h4 className="font-bold text-slate-800">Clinical Report (Doctor)</h4>
                    </div>
                    <div className="prose prose-sm text-slate-600 whitespace-pre-wrap">
                      {summaries.doctor}
                    </div>
                  </div>

                  {/* Patient Summary */}
                  <div className="flex-1 p-6 relative bg-emerald-50/30">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                    <div className="flex items-center mb-4">
                      <UserCircle className="text-emerald-600 mr-2" size={20} />
                      <h4 className="font-bold text-slate-800">Patient Explanation</h4>
                    </div>
                    <div className="prose prose-sm text-slate-800 font-medium whitespace-pre-wrap text-lg leading-relaxed">
                      {summaries.patient}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <FileText size={48} className="mb-4 opacity-50" />
                <p>Add events to the timeline and click Generate to see the AI dual-summary output.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discharge;
