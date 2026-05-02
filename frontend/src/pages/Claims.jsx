import React, { useState } from 'react';
import { Search, ShieldCheck, Activity, Download, Loader2, Sparkles, FileText } from 'lucide-react';
import api from '../api';

const Claims = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);

  const processClaim = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setSteps([]);
    
    try {
      const res = await api.post('/insurance/process', { query });
      if (res.data && res.data.data) {
        setResult(res.data.data.result || "Claim processed successfully.");
        setSteps(res.data.data.steps || []);
      }
    } catch (err) {
      console.error(err);
      setResult("Failed to process the insurance claim. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Insurance Claims Engine</h1>
        <p className="text-slate-500 font-medium">Process patient claims using autonomous AI agents.</p>
      </header>

      {/* Claim Search */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="e.g. Process insurance claim for 45 year old diabetic patient Ravi Kumar..." 
            className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={processClaim}
          disabled={loading || !query.trim()}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          Process Claim
        </button>
      </div>

      {(result || loading || steps.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Agent Reasoning Timeline */}
          <div className="lg:col-span-5 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-slate-900 text-lg">Agent Reasoning Steps</h3>
              <Activity className="text-indigo-500" size={20} />
            </div>
            
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 min-h-[200px]">
              {loading && steps.length === 0 && (
                <div className="flex items-center gap-3 text-slate-400 text-sm ml-4">
                  <Loader2 className="animate-spin" size={16} />
                  Initializing Insurance Agent...
                </div>
              )}
              {steps.map((step, index) => (
                <div key={index} className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white rounded-full border-4 border-indigo-500"></div>
                  <h4 className="text-sm font-bold text-slate-800">Step {index + 1}</h4>
                  <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed mt-2 italic">
                    "{step}"
                  </div>
                </div>
              ))}
              {result && (
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white rounded-full border-4 border-emerald-500"></div>
                  <h4 className="text-sm font-bold text-emerald-600">Decision Reached</h4>
                </div>
              )}
            </div>
          </div>

          {/* Final Decision Area */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <ShieldCheck size={120} />
                   </div>
                   <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <ShieldCheck size={24} className="text-indigo-400" />
                     Final Claim Decision
                   </h3>
                   <div className="text-slate-300 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                     {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                   </div>
                   <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
                     <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Processed by MediFlow AI</span>
                     <button className="flex items-center gap-2 text-indigo-400 font-bold hover:text-white transition-colors">
                       <Download size={18} />
                       Export Report
                     </button>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-20 text-center min-h-[400px]">
                {loading ? (
                  <>
                    <Loader2 size={64} className="text-indigo-200 mb-4 animate-spin" />
                    <h4 className="font-bold text-slate-400 mb-2">Processing Claim...</h4>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                      The AI agent is currently analyzing policies and evaluating the claim data.
                    </p>
                  </>
                ) : (
                  <>
                    <FileText size={64} className="text-slate-200 mb-4" />
                    <h4 className="font-bold text-slate-400 mb-2">Awaiting Analysis</h4>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                      Enter a claim query to begin automated processing.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Claims;
