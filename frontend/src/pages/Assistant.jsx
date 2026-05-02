import React, { useState, useEffect } from 'react';
import { Send, Loader2, Bot } from 'lucide-react';
import api from '../api';

const Assistant = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem('user');
      if (u) setUser(JSON.parse(u));
    } catch(e) {}
  }, []);

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsThinking(true);
    setResult(null);

    try {
      const res = await api.post('/brain/query', { query });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: "Failed to connect to the brain agent." });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-12 flex flex-col items-center min-h-[calc(100vh-100px)]">
      {/* Welcome Header */}
      <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-top-8 duration-1000">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">
          Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600 font-bold italic">{user?.name ? user.name : 'Doctor'}</span>, <br />
          welcome to MediFlow
        </h2>
        <p className="text-slate-500 text-lg max-w-lg mx-auto">
          How can I assist your clinical operations today? Ask me about claims, patient reports, or inventory.
        </p>
      </div>

      {/* Main Query Box */}
      <div className="w-full relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <form 
          onSubmit={handleQuery}
          className="relative bg-white rounded-[1.8rem] shadow-xl border border-slate-100 p-2 flex items-center gap-2"
        >
          <div className="pl-6 text-brand-500">
            <Bot size={24} />
          </div>
          <input 
            type="text" 
            placeholder="Type your clinical request here..." 
            className="flex-1 bg-transparent border-none outline-none p-4 text-slate-800 text-lg placeholder:text-slate-300 font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isThinking}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isThinking ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            Process
          </button>
        </form>
      </div>

      {/* Thinking Indicator */}
      <div className={`mt-8 flex items-center gap-3 text-brand-600 font-bold text-sm tracking-widest uppercase transition-all duration-500 ${isThinking ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-bounce"></div>
        </div>
        Thinking...
      </div>

      {/* Result Display Area */}
      {result && (
        <div className="mt-12 w-full animate-in zoom-in-95 duration-500 pb-20">
          <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-3 h-full bg-brand-600"></div>
            
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0 shadow-sm border border-brand-100">
                <Bot size={32} />
              </div>
              
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="font-black text-slate-900 text-xl mb-1 tracking-tight">MediFlow Brain Analysis</h4>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Autonomous Agent Response</p>
                </div>

                <div className="text-slate-700 leading-relaxed text-lg prose max-w-none">
                  {/* Handle Insurance Agent Result */}
                  {result.result && typeof result.result === 'string' && (
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                      {result.result}
                    </div>
                  )}

                  {/* Handle Discharge Agent Result */}
                  {result.summaries && (
                    <div className="space-y-4">
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-800">
                        <p className="font-bold text-xs uppercase mb-2">Patient Summary</p>
                        {result.summaries.patientSummary}
                      </div>
                      <div className="p-4 bg-slate-900 rounded-xl text-slate-300 text-sm">
                        <p className="font-bold text-xs text-brand-400 uppercase mb-2">Clinical Note</p>
                        {result.summaries.clinicalSummary}
                      </div>
                    </div>
                  )}

                  {/* Handle Error/Clarity Result */}
                  {result.error && (
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-700 font-bold">
                      {result.error}
                    </div>
                  )}

                  {/* Fallback for other data */}
                  {!result.result && !result.summaries && !result.error && (
                    <div className="font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {typeof result === 'object' ? JSON.stringify(result, null, 2) : result}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;
