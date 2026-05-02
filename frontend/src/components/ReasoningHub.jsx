import React, { useState, useEffect } from 'react';
import { Terminal, Brain, Cpu, Clock } from 'lucide-react';
import api from '../api';

const ReasoningHub = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/brain/logs');
        if (res.data.success) {
          setLogs(res.data.logs.reverse().slice(0, 10)); // Last 10 logs
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
    <div className="bg-slate-900 rounded-2xl p-6 text-emerald-400 font-mono text-xs shadow-2xl border border-slate-800 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 font-sans font-bold text-base">
          <Brain size={20} />
          <span>Agent Reasoning Hub</span>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-slate-500 font-sans">LIVE SYSTEM</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic py-8 text-center font-sans">
            Awaiting agent activity...
          </div>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="animate-in slide-in-from-right-4 duration-300 border-l border-slate-800 pl-4 py-1 relative">
              <div className="absolute left-[-5px] top-2 w-2 h-2 rounded-full bg-indigo-500/50"></div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-900/50 text-indigo-300 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  {log.agent}
                </span>
                <span className="text-slate-600 text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-emerald-300 leading-relaxed mb-1 italic">
                "{log.thought}"
              </div>
              {log.action && (
                <div className="flex items-center gap-1.5 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                  <Cpu size={12} />
                  Action: {log.action}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-slate-500 font-sans text-[10px]">
        <div className="flex items-center gap-1">
          <Terminal size={12} />
          <span>v2.1.0-stable</span>
        </div>
        <span>{logs.length} events logged</span>
      </div>
    </div>
  );
};

export default ReasoningHub;
