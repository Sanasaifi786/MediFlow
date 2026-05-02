import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, Activity, Download, Loader2, Sparkles, FileText, AlertCircle } from 'lucide-react';
import api from '../api';

const Claims = () => {
  // Query state for quick AI prompt
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);

  // Database policies state
  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);

  // Switcher for either Quick AI Prompt or Detailed Claim Form
  const [activeTab, setActiveTab] = useState('prompt');

  // Form Fields for Detailed Form
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [policyNo, setPolicyNo] = useState('');
  const [disease, setDisease] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  // Fetch policies on component mount
  const fetchPolicies = async () => {
    try {
      setPoliciesLoading(true);
      const res = await api.get('/insurance/all');
      if (res.data.success) {
        setPolicies(res.data.policies || []);
      }
    } catch (err) {
      console.error('Failed to fetch insurance policies', err);
    } finally {
      setPoliciesLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Format any output into a structured object for the Report Card
  const formatResult = (resValue, inName, inAge, inDisease) => {
    if (typeof resValue === 'object' && resValue !== null) {
      if (!resValue.patient) {
        resValue.patient = {
          name: inName || 'N/A',
          age: inAge || 'N/A',
          disease: inDisease || 'N/A'
        };
      }
      return resValue;
    }
    if (typeof resValue === 'string') {
      try {
        const startIndex = resValue.indexOf('{');
        const endIndex = resValue.lastIndexOf('}');
        if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
          const cleaned = resValue.substring(startIndex, endIndex + 1);
          const parsed = JSON.parse(cleaned);
          if (parsed && typeof parsed === 'object') {
            if (!parsed.patient) {
              parsed.patient = {
                name: inName || 'N/A',
                age: inAge || 'N/A',
                disease: inDisease || 'N/A'
              };
            }
            return parsed;
          }
        }
      } catch (e) {
        // Fallback below
      }

      const isApproved = /approve|eligible|accept|success/i.test(resValue);
      const riskMatch = resValue.match(/risk:\s*(\w+)/i) || resValue.match(/(\w+)\s*risk/i);
      const risk = riskMatch ? riskMatch[1] : (isApproved ? 'Low' : 'Medium/High');

      return {
        status: isApproved ? 'approved' : 'rejected',
        claim_amount: 'Evaluated by Policy Limit',
        confidence: 85,
        risk,
        patient: {
          name: inName || 'N/A',
          age: inAge || 'N/A',
          disease: inDisease || 'N/A'
        },
        message: resValue
      };
    }
    return resValue;
  };

  const processClaim = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    setSteps([]);
    
    try {
      const res = await api.post('/insurance/process', { query });
      if (res.data && res.data.data) {
        if (res.data.data.error) {
          setResult({
            error: true,
            message: res.data.data.error + (res.data.data.message ? `: ${res.data.data.message}` : '')
          });
        } else {
          const formatted = formatResult(res.data.data.result, 'Extracted via AI', 'N/A', 'N/A');
          setResult(formatted);
        }
        setSteps(res.data.data.steps || []);
      }
    } catch (err) {
      console.error(err);
      setResult({
        error: true,
        message: err.response?.data?.error || "Failed to process the insurance claim. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const processFormClaim = async (e) => {
    e.preventDefault();
    if (!name || !age || !policyNo || !disease) return;
    setLoading(true);
    setResult(null);
    setSteps([]);

    const craftedQuery = `Process insurance claim for ${age} year old ${disease} patient ${name} with policy ID ${policyNo} and estimated cost ₹${estimatedCost || 0}`;
    
    try {
      const res = await api.post('/insurance/process', { query: craftedQuery });
      if (res.data && res.data.data) {
        if (res.data.data.error) {
          setResult({
            error: true,
            message: res.data.data.error + (res.data.data.message ? `: ${res.data.data.message}` : '')
          });
        } else {
          const formatted = formatResult(res.data.data.result, name, age, disease);
          setResult(formatted);
        }
        setSteps(res.data.data.steps || []);
      }
    } catch (err) {
      console.error(err);
      setResult({
        error: true,
        message: err.response?.data?.error || "Failed to process the insurance claim. Please try again."
      });
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


      {/* Tabs Switcher for Query vs Detailed Form */}
      <div className="flex gap-4 border-b border-slate-100">
        <button
          onClick={() => setActiveTab('prompt')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'prompt' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Quick AI Prompt
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'form' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          Detailed Claim Form
        </button>
      </div>

      {activeTab === 'prompt' ? (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="e.g. Process insurance claim for 45 year old diabetic patient Ravi Kumar..." 
              className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
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
      ) : (
        <form onSubmit={processFormClaim} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Patient Name</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Age</label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 45"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Policy Number (ID)</label>
              <input
                type="text"
                required
                placeholder="e.g. 660f7bc..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                value={policyNo}
                onChange={(e) => setPolicyNo(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Diagnosis / Disease</label>
              <input
                type="text"
                required
                placeholder="e.g. Hypertension"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Estimated Treatment Cost (₹)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 50000"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-500"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !name || !age || !policyNo || !disease}
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            Submit Detailed Claim
          </button>
        </form>
      )}

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
              {result && !result.error && (
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white rounded-full border-4 border-emerald-500"></div>
                  <h4 className="text-sm font-bold text-emerald-600">Decision Reached</h4>
                </div>
              )}
              {result && result.error && (
                <div className="relative pl-8">
                  <div className="absolute -left-[11px] top-1 w-5 h-5 bg-white rounded-full border-4 border-rose-500"></div>
                  <h4 className="text-sm font-bold text-rose-600">Error Occurred</h4>
                </div>
              )}
            </div>
          </div>

          {/* Final Decision Area */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                {result.error ? (
                  <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 shadow-sm space-y-4 text-rose-800">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-rose-600" size={28} />
                      <h3 className="text-xl font-black">Processing Failed</h3>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{result.message}</p>
                  </div>
                ) : typeof result === 'object' && result !== null ? (
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl space-y-6 text-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                      <ShieldCheck size={140} />
                    </div>
                    <div className="flex items-center justify-between border-b pb-5">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                          <ShieldCheck size={26} className="text-brand-600" />
                          Claim Report Card
                        </h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Processed by MediFlow AI Agent</p>
                      </div>
                      <span className={`px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-wider ${
                        result.status === 'approved' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {result.status || 'unknown'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Profile</p>
                        <p className="text-base font-black text-slate-800 truncate">{result.patient?.name || 'N/A'}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age / Diagnosis</p>
                        <p className="text-base font-black text-slate-800 capitalize truncate">
                          {result.patient?.age || 'N/A'} Yrs / {result.patient?.disease || 'N/A'}
                        </p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confidence Score</p>
                        <p className="text-base font-black text-slate-800">{result.confidence !== undefined ? `${result.confidence}%` : '85%'}</p>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Assessment</p>
                        <p className="text-base font-black text-slate-800 capitalize">{result.risk || 'Low'}</p>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 col-span-2 flex justify-between items-center bg-gradient-to-r from-slate-50 to-brand-50/20">
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Claim Coverage / Amount</p>
                          <p className="text-2xl font-black text-brand-600">
                            {typeof result.claim_amount === 'number' ? `₹${result.claim_amount.toLocaleString()}` : result.claim_amount || 'Evaluated by Limit'}
                          </p>
                        </div>
                        <button className="flex items-center gap-2 text-brand-600 font-bold hover:text-brand-800 transition-all text-sm bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm">
                          <Download size={16} />
                          Export
                        </button>
                      </div>
                    </div>

                    {result.message && typeof result.message === 'string' && (
                      <div className="bg-amber-50 border border-amber-200/50 p-4 rounded-2xl text-amber-800 text-sm font-medium leading-relaxed">
                        {result.message}
                      </div>
                    )}
                  </div>
                ) : (
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
                )}
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
