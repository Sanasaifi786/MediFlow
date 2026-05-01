import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Package, AlertCircle, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Insurance Claims',
      description: 'Process patient claims with AI scoring and automated policy validation.',
      icon: ShieldCheck,
      color: 'from-blue-500 to-indigo-600',
      path: '/insurance',
      metric: '12 Pending',
    },
    {
      title: 'Discharge Summaries',
      description: 'Generate clinical and patient-friendly summaries instantly from timeline events.',
      icon: FileText,
      color: 'from-emerald-400 to-teal-500',
      path: '/discharge',
      metric: '5 Ready',
    },
    {
      title: 'Inventory Manager',
      description: 'Track medicine stock levels with autonomous low-stock detection and alerts.',
      icon: Package,
      color: 'from-orange-400 to-rose-500',
      path: '/inventory',
      metric: '2 Alerts',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hospital Overview</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your hospital operations intelligently.</p>
        </div>
      </header>

      {/* Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <div 
            key={idx}
            onClick={() => navigate(card.path)}
            className="group relative bg-white rounded-2xl p-6 cursor-pointer overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg`}>
                <card.icon size={24} />
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                {card.metric}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-slate-500 text-sm mb-6 line-clamp-2">{card.description}</p>
            
            <div className="flex items-center text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">
              Open Module <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <ActivityIcon className="mr-2 text-indigo-500" /> Recent Activity
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mr-4 flex-shrink-0">
                  {i === 1 ? <ShieldCheck size={20} /> : i === 2 ? <FileText size={20} /> : <AlertCircle size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800">
                    {i === 1 ? 'Claim #1092 Approved' : i === 2 ? 'Discharge Summary Generated for John Doe' : 'Low Stock Alert: Paracetamol 500mg'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{i * 10} minutes ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h3 className="text-lg font-bold mb-6 relative z-10">System Status</h3>
          
          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-indigo-200">AI Processing Load</span>
                <span className="font-semibold text-white">42%</span>
              </div>
              <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[42%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-indigo-200">API Requests (Today)</span>
                <span className="font-semibold text-white">1,240 / 5,000</span>
              </div>
              <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 w-[25%] rounded-full"></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-indigo-800/50 mt-4">
              <div className="flex items-center text-emerald-400 text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                All Agents Online & Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper icon component
const ActivityIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

export default Dashboard;
