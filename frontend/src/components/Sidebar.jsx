import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, FileText, Package } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Activity },
    { name: 'Insurance', path: '/insurance', icon: ShieldCheck },
    { name: 'Discharge', path: '/discharge', icon: FileText },
    { name: 'Inventory', path: '/inventory', icon: Package },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-slate-200 bg-white/80 backdrop-blur-xl flex flex-col z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl">
          M
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          MediFlow AI
        </h1>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Dr+Smith&background=random" alt="Doctor" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">Dr. Smith</span>
            <span className="text-xs text-slate-500">Cardiology</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
