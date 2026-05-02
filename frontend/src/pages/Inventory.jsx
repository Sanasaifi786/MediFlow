import React, { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, CheckCircle, Loader2, Sparkles, FileText, Activity, Download } from 'lucide-react';
import api from '../api';

const Inventory = () => {
  const [query, setQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [agentResponse, setAgentResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [highlightedItem, setHighlightedItem] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setFetching(true);
    try {
      const res = await api.get('/auth/dashboard');
      if (res.data.allInventory) {
        setInventory(res.data.allInventory);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setFetching(false);
    }
  };

  const processQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setHighlightedItem(null);
    
    try {
      const res = await api.post('/inventory/process', { query });
      const data = res.data.data || res.data;
      
      setAgentResponse({
        result: data.error || (data.itemName ? `${data.itemName} quantity updated.` : "Operation completed."),
        data: data
      });

      if (data.itemName) {
        setHighlightedItem(data.itemName);
        // Clear highlight after 10 seconds
        setTimeout(() => setHighlightedItem(null), 10000);
      }
      
      fetchInventory();
    } catch (err) {
      setAgentResponse({
        result: "Failed to process the inventory request. Please check system logs.",
        reasoning: "The agent encountered an error while communicating with the database or processing the natural language query."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Agent Console</h1>
        <p className="text-slate-500 font-medium">Manage hospital supplies and track stock using autonomous AI.</p>
      </header>

      {/* Agent Search */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Ask AI: 'Update Paracetamol to 500' or 'Show low stock'..." 
            className="w-full pl-12 p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-brand-500 transition-all font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={processQuery}
          disabled={loading || !query.trim()}
          className="w-full md:w-auto bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          Consult Agent
        </button>
      </div>

      {/* Main Inventory Catalog */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Package className="text-brand-600" size={24} />
            <h3 className="font-bold text-slate-800 text-lg">Hospital Supply Catalog</h3>
          </div>
          <div className="flex items-center gap-4">
            {highlightedItem && (
              <span className="text-[10px] font-black text-brand-600 bg-brand-50 px-3 py-1 rounded-full uppercase animate-pulse">
                Target: {highlightedItem}
              </span>
            )}
            <button 
              onClick={fetchInventory}
              className="px-4 py-2 bg-white text-xs font-bold text-brand-600 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <Activity size={14} />
              Sync Inventory
            </button>
          </div>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white border-b border-slate-50">
                <th className="px-10 py-5">Medicine Name</th>
                <th className="px-10 py-5 text-center">Current Stock</th>
                <th className="px-10 py-5 text-center">Safety Threshold</th>
                <th className="px-10 py-5 text-right">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {fetching ? (
                <tr>
                  <td colSpan="4" className="px-10 py-24 text-center">
                    <Loader2 size={40} className="animate-spin text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Database...</p>
                  </td>
                </tr>
              ) : inventory.length > 0 ? (
                inventory.map((item) => {
                  const isLow = item.current_stock <= item.threshold;
                  const isHighlighted = highlightedItem && item.medicine_name.toLowerCase() === highlightedItem.toLowerCase();
                  
                  return (
                    <tr 
                      key={item._id} 
                      className={`transition-all duration-500 group ${
                        isHighlighted 
                        ? 'bg-brand-50 ring-2 ring-brand-500 ring-inset shadow-inner scale-[1.01] z-10 relative' 
                        : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform duration-500 ${isHighlighted ? 'scale-110' : ''} ${
                            isLow ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                            <Package size={22} />
                          </div>
                          <div>
                            <p className={`font-bold text-base transition-colors ${isHighlighted ? 'text-brand-700' : 'text-slate-900'}`}>
                              {item.medicine_name}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">SKU: {item._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`text-2xl font-black transition-all ${
                          isHighlighted ? 'text-brand-600' : (isLow ? 'text-rose-600' : 'text-slate-800')
                        }`}>
                          {item.current_stock}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-center text-slate-400 font-bold">
                        {item.threshold} units
                      </td>
                      <td className="px-10 py-6 text-right">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                          isLow ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLow ? 'bg-rose-600' : 'bg-emerald-600'}`}></div>
                          {isLow ? 'Critical Level' : 'Stable Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-10 py-24 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200">
                      <Package size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-medium">No inventory records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
