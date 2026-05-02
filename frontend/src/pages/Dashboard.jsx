import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, FileText, Package, AlertCircle, ArrowRight, Cpu } from 'lucide-react';
import ReasoningHub from '../components/ReasoningHub';

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-[500px]">
          <ReasoningHub />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden flex-1 min-h-[300px]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h3 className="text-lg font-bold mb-6 relative z-10 flex items-center gap-2">
              <Cpu size={20} className="text-indigo-400" /> System Health
            </h3>
            
            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-indigo-200">AI Inference Load</span>
                  <span className="font-semibold text-white">42%</span>
                </div>
                <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[42%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-indigo-200">System Latency</span>
                  <span className="font-semibold text-white">124ms</span>
                </div>
                <div className="h-2 bg-indigo-950 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 w-[25%] rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-indigo-200">Active Agents</span>
                  <span className="font-semibold text-white">4 / 4</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {['Insurance', 'Discharge', 'Inventory', 'Brain'].map((agent) => (
                    <div key={agent} className="px-2 py-1 bg-indigo-950/50 border border-indigo-800 rounded text-[10px] text-indigo-300">
                      {agent}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-6 border-t border-indigo-800/50 mt-6">
                <div className="flex items-center text-emerald-400 text-xs font-medium">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></div>
                  Multi-Agent Mesh Network Active
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg group cursor-pointer hover:bg-indigo-700 transition-colors">
            <h4 className="font-bold mb-1">New Feature Alert</h4>
            <p className="text-indigo-100 text-xs leading-relaxed opacity-80">The Brain Agent now supports complex reasoning across all hospital departments. Try asking a cross-functional query!</p>
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
