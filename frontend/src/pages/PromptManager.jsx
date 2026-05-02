import React, { useState, useEffect } from 'react';
import { Bot, Save, RefreshCw, AlertTriangle, CheckCircle2, Loader2, Code2 } from 'lucide-react';
import api from '../api';

const PromptManager = () => {
  const [prompts, setPrompts] = useState([]);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/prompts');
      setPrompts(res.data.prompts);
      if (res.data.prompts.length > 0) {
        handleSelect(res.data.prompts[0]);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to fetch prompt files from server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (p) => {
    setSelectedPrompt(p);
    setContent(p.content);
    setStatus({ type: '', message: '' });
  };

  const handleSave = async () => {
    if (!selectedPrompt) return;
    setSaving(true);
    try {
      await api.post('/prompts/update', { name: selectedPrompt.name, content });
      setStatus({ type: 'success', message: `${selectedPrompt.name} updated successfully.` });
      // Update local state
      setPrompts(prompts.map(p => p.name === selectedPrompt.name ? { ...p, content } : p));
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save prompt. Check server logs.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[500px] gap-4">
        <Loader2 className="animate-spin text-brand-600" size={40} />
        <p className="text-slate-400 font-bold animate-pulse">Initializing AI Kernels...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-8 animate-in fade-in duration-700 pb-20">
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-4">
          <Code2 size={12} />
          AI Engine Configuration
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Prompts</h1>
        <p className="text-slate-500 font-medium">Fine-tune the reasoning logic and personas for all clinical agents.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 h-[650px]">
        {/* Sidebar: Prompt List */}
        <div className="lg:col-span-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Active Modules</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {prompts.map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelect(p)}
                className={`w-full text-left px-5 py-4 rounded-2xl transition-all flex flex-col gap-1 ${
                  selectedPrompt?.name === p.name 
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]' 
                  : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="font-bold text-sm">{p.name.replace('.js', '').toUpperCase()}</span>
                <span className={`text-[10px] ${selectedPrompt?.name === p.name ? 'text-slate-400' : 'text-slate-300'}`}>
                  Agent Logic Core
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <span className="font-black text-slate-900 text-sm tracking-tight">
                  {selectedPrompt?.name}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {status.message && (
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full animate-in fade-in slide-in-from-right-4 ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {status.message}
                  </span>
                )}
                <button 
                  onClick={() => handleSelect(selectedPrompt)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all border border-slate-100"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  disabled={saving || !selectedPrompt}
                  className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                  Deploy Logic
                </button>
              </div>
            </div>

            <div className="flex-1 p-0 relative">
              <textarea 
                className="w-full h-full p-8 font-mono text-sm bg-slate-950 text-emerald-400 outline-none resize-none selection:bg-brand-500 selection:text-white"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                spellCheck="false"
              />
              <div className="absolute bottom-6 right-8 pointer-events-none opacity-20">
                <Code2 size={120} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="font-bold text-amber-800 text-sm mb-1">Caution: Kernel Modification</h4>
              <p className="text-amber-700/70 text-xs leading-relaxed">
                Changes to system prompts directly affect how clinical data is analyzed. 
                Ensure all templates maintain their <strong>JSON response format</strong> to avoid breaking agent communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptManager;
