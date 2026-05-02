import React, { useState } from 'react';
import { UserPlus, Shield, Mail, Lock, User, Briefcase, Phone, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'doctor',
    department: 'General',
    phone: '',
    salary: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'doctor', label: 'Doctor' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'inventory_manager', label: 'Inventory Manager' },
    { value: 'insurance_manager', label: 'Insurance Manager' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await api.post('/auth/employees', formData);
      setStatus({ type: 'success', message: `Successfully registered ${formData.name} as ${formData.role}.` });
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'doctor',
        department: 'General',
        phone: '',
        salary: '',
      });
    } catch (err) {
      setStatus({ 
        type: 'error', 
        message: err.response?.data?.message || 'Failed to register employee. Check your permissions.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 animate-in fade-in duration-700">
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Authorization</h1>
        <p className="text-slate-500 font-medium">Onboard new personnel and assign role-based access levels.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Info Sidebar */}
        <div className="w-full md:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center mb-6">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold mb-4">Security Protocol</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Every new account is automatically granted restricted access based on their designation. 
              Institutional email is required for all staff members.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                Encrypted Passwords
              </li>
              <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                Role Verification
              </li>
              <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500"></div>
                Audit Log Tracking
              </li>
            </ul>
          </div>
          <div className="mt-12 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-[10px] text-slate-500 uppercase tracking-tighter">
            Authorized by MediFlow Security Hub
          </div>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="flex-1 p-10 space-y-6">
          {status.message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {status.type === 'success' ? <CheckCircle2 size={18} /> : <Shield size={18} />}
              <span className="text-sm font-bold">{status.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Official Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="j.doe@mediflow.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Initial Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Designation</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium appearance-none"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
              <input 
                type="text" 
                placeholder="Cardiology / Administration"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  placeholder="+1 234 567 890"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Annual Salary (INR)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="number" 
                  required
                  placeholder="850000"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-brand-100 focus:bg-white transition-all text-sm font-medium"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-slate-900 text-white py-4 rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
            Authorize New Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
