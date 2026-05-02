import React, { useState, useEffect } from 'react';
import { Terminal, Brain, Cpu, Clock, Search, Filter } from 'lucide-react';
import api from '../api';

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/brain/logs');
        if (res.data.success) {
          setLogs(res.data.logs.reverse());
        }
      } catch (err) {
        console.error('Failed to fetch logs', err);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agent Reasoning Logs</h1>
          <p className="text-slate-500 font-medium">Real-time monitoring of AI department workflows.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2 text-sm text-slate-500">
             <Filter size={16} />
             All Departments
           </div>
           <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-100">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></div>
             Live System
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {logs.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-24 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
            <Terminal size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-400 font-bold">No clinical activity recorded yet.</p>
          </div>
        ) : (
          logs.map((log, idx) => (
            <div 
              key={idx} 
              className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-right-4"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <div className="flex items-start gap-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  log.agent === 'Insurance' ? 'bg-blue-50 text-blue-600' :
                  log.agent === 'Discharge' ? 'bg-teal-50 text-teal-600' :
                  'bg-indigo-50 text-indigo-600'
                }`}>
                  <Brain size={24} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{log.agent} Agent</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.action || 'Thinking'}</span>
                    </div>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm italic mb-3 leading-relaxed">
                    "{log.thought}"
                  </p>
                  {log.input && (
                    <div className="bg-slate-50 rounded-lg p-3 text-[10px] font-mono text-slate-500 overflow-x-auto">
                      <span className="font-bold text-slate-400 mr-2 uppercase">Input:</span>
                      {typeof log.input === 'object' ? JSON.stringify(log.input) : log.input}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logs;
