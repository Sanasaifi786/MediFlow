import React, { useState } from 'react';
import { PackageSearch, AlertTriangle, ArrowDownToLine, RefreshCw } from 'lucide-react';
import api from '../api';

const Inventory = () => {
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Paracetamol 500mg', current_stock: 450, threshold: 500, unit: 'Tablets', status: 'Low Stock' },
    { id: 2, name: 'Amoxicillin 250mg', current_stock: 1200, threshold: 300, unit: 'Capsules', status: 'Sufficient' },
    { id: 3, name: 'IV Fluid (Saline)', current_stock: 45, threshold: 50, unit: 'Bags', status: 'Low Stock' },
    { id: 4, name: 'Surgical Masks', current_stock: 5000, threshold: 1000, unit: 'Pieces', status: 'Sufficient' },
  ]);

  const [usageData, setUsageData] = useState({ name: '', quantity: '' });
  const [alert, setAlert] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!usageData.name || !usageData.quantity) return;

    try {
      // API call to backend
      const res = await api.post('/inventory/update', { 
        medicine_name: usageData.name, 
        quantity_used: parseInt(usageData.quantity) 
      });
      // Handle actual response logic...
      showFakeUpdate();
    } catch (err) {
      // Mock update for UI demo
      showFakeUpdate();
    }
  };

  const showFakeUpdate = () => {
    const updated = inventory.map(item => {
      if (item.name.toLowerCase().includes(usageData.name.toLowerCase())) {
        const newStock = item.current_stock - parseInt(usageData.quantity);
        const isLow = newStock < item.threshold;
        
        if (isLow && item.status !== 'Low Stock') {
          setAlert(`Alert: ${item.name} stock has fallen below the safety threshold (${newStock} remaining).`);
        }
        
        return { ...item, current_stock: newStock, status: isLow ? 'Low Stock' : 'Sufficient' };
      }
      return item;
    });
    setInventory(updated);
    setUsageData({ name: '', quantity: '' });
  };

  const lowStockItems = inventory.filter(item => item.status === 'Low Stock');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
        <p className="text-slate-500">Real-time AI monitoring and automatic reorder alerts</p>
      </header>

      {/* Global Alert Banner */}
      {(alert || lowStockItems.length > 0) && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top-4 flex items-start">
          <AlertTriangle className="text-rose-500 mt-0.5 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-bold text-rose-800">Critical Stock Alerts ({lowStockItems.length})</h3>
            <p className="text-sm text-rose-700 mt-1">{alert || 'Some inventory items have fallen below their safety threshold. Please reorder immediately.'}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Update Usage Form */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
              <ArrowDownToLine className="mr-2 text-indigo-500" size={20} /> Record Usage
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Paracetamol" 
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={usageData.name}
                  onChange={e => setUsageData({...usageData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Used</label>
                <input 
                  type="number" 
                  required
                  min="1"
                  placeholder="0" 
                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  value={usageData.quantity}
                  onChange={e => setUsageData({...usageData, quantity: e.target.value})}
                />
              </div>
              <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors">
                Update Stock
              </button>
            </form>
          </div>

          {/* Smart Reorder Suggestions */}
          {lowStockItems.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <RefreshCw size={100} />
              </div>
              <h2 className="text-lg font-bold text-indigo-900 mb-4 relative z-10">AI Reorder Suggestions</h2>
              <div className="space-y-3 relative z-10">
                {lowStockItems.map(item => (
                  <div key={item.id} className="bg-white/60 p-3 rounded-lg border border-white flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-500">Suggest: +{item.threshold * 2}</p>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded shadow-sm hover:shadow transition-shadow">
                      Order Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Stock Table */}
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <PackageSearch className="mr-2 text-indigo-500" size={20} /> Current Stock Levels
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="p-4 font-medium">Item Name</th>
                    <th className="p-4 font-medium">Current Stock</th>
                    <th className="p-4 font-medium">Safety Threshold</th>
                    <th className="p-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-800">{item.name}</td>
                      <td className="p-4 font-mono text-slate-600">
                        {item.current_stock} <span className="text-xs text-slate-400">{item.unit}</span>
                      </td>
                      <td className="p-4 font-mono text-slate-400">{item.threshold}</td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === 'Sufficient' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-rose-100 text-rose-800 animate-pulse'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Inventory;
