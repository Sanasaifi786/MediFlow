import React, { useState } from 'react';
import { Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api';

const Insurance = () => {
  const [formData, setFormData] = useState({ name: '', age: '', disease: '', policyType: 'Gold', pastClaims: 0 });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setSteps(['Initializing Insurance Agent...', 'Extracting patient entities...']);
    
    // Simulate thinking steps for demo wow-factor
    setTimeout(() => setSteps(s => [...s, 'Fetching policy details...']), 1500);
    setTimeout(() => setSteps(s => [...s, 'Estimating treatment cost...']), 3000);
    setTimeout(() => setSteps(s => [...s, 'Evaluating eligibility & risk...']), 4500);

    try {
      // Create a natural language query for the agent
      const query = `Patient ${formData.name}, ${formData.age}yo, diagnosed with ${formData.disease}. Policy: ${formData.policyType}, Past claims: ${formData.pastClaims}`;
      const res = await api.post('/insurance/process', { query });
      
      const { result: agentResult, steps: agentSteps } = res.data.data;
      
      // Gradually add real steps for interactive feel
      if (agentSteps && agentSteps.length > 0) {
        agentSteps.forEach((step, index) => {
          setTimeout(() => {
            setSteps(s => [...s, `[REASONING] ${step}`]);
          }, index * 1000);
        });
      }

      setTimeout(() => {
        setResult(agentResult);
        setLoading(false);
      }, (agentSteps?.length || 1) * 1000 + 500);
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        setResult({ status: 'Rejected', score: 10, amount: 0, reason: 'Failed to process claim via API' });
        setLoading(false);
      }, 5500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Insurance Claim Processing</h1>
        <p className="text-slate-500">End-to-end AI agent evaluation</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <h2 className="text-xl font-bold mb-6 text-slate-800">Patient Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input required type="number" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} placeholder="45" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis / Disease</label>
              <input required type="text" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.disease} onChange={e => setFormData({...formData, disease: e.target.value})} placeholder="Viral Fever" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Policy Type</label>
                <select className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.policyType} onChange={e => setFormData({...formData, policyType: e.target.value})}>
                  <option>Basic</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Past Claims</label>
                <input required type="number" className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={formData.pastClaims} onChange={e => setFormData({...formData, pastClaims: e.target.value})} min="0" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center">
              {loading ? <><Loader2 className="animate-spin mr-2" size={20} /> Agent Thinking...</> : 'Process Claim via AI Agent'}
            </button>
          </form>
        </div>

        {/* Right: Agent Thinking & Result */}
        <div className="flex flex-col gap-6">
          {/* Agent Stepper */}
          {(loading || steps.length > 0) && (
            <div className="bg-slate-900 rounded-2xl p-6 text-emerald-400 font-mono text-sm shadow-xl border border-slate-800">
              <div className="flex items-center text-indigo-400 mb-4 font-sans font-bold text-base">
                <Activity className="mr-2" size={20} /> Agent Workflow Live
              </div>
              <div className="space-y-2">
                {steps.map((step, i) => (
                  <div key={i} className="flex items-center animate-in slide-in-from-left-2 opacity-0 fill-mode-forwards" style={{animationDelay: `${i * 0.2}s`}}>
                    <span className="text-slate-500 mr-2">[{new Date().toLocaleTimeString()}]</span> {step}
                  </div>
                ))}
                {loading && <div className="flex items-center mt-2 text-indigo-400"><Loader2 className="animate-spin mr-2" size={14} /> _</div>}
              </div>
            </div>
          )}

          {/* Final Result Card */}
          {result && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 animate-in zoom-in-95 duration-500 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-full -mr-10 -mt-10 opacity-10 ${result.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Claim Decision</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${result.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {result.status === 'Approved' ? <CheckCircle size={16} className="mr-1"/> : <XCircle size={16} className="mr-1"/>}
                    {result.status}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500 font-medium">Claim Amount</p>
                  <p className="text-3xl font-extrabold text-slate-900">₹{result.amount || result.estimated_cost || 0}</p>
                </div>
              </div>

              {/* Wow Factor: Score Meter */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">Approval Confidence Score</span>
                  <span className={result.score >= 70 ? 'text-emerald-600' : 'text-rose-600'}>{result.score}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1500 ease-out ${result.score >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed"><span className="font-bold">Agent Reasoning:</span> {result.reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insurance;
