import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Terminal, FileText, User, LogOut, ChevronUp } from 'lucide-react';

const Sidebar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        setUser(JSON.parse(u));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { name: 'Assistant', path: '/app', icon: Bot },
    { name: 'Logs', path: '/app/logs', icon: Terminal },
    { name: 'Report', path: '/app/reports', icon: FileText },
  ];

  return (
    <aside className="w-72 h-screen flex flex-col bg-white border-r border-slate-200 sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-brand-200">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">MediFlow</h1>
            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Doctor Portal</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-brand-50 text-brand-600 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'text-brand-600' : 'text-slate-400'} />
                <span className="font-bold text-sm tracking-wide">{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-100 relative">
        {/* Profile Dropdown Card */}
        {isProfileOpen && (
          <div className="absolute bottom-24 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in slide-in-from-bottom-2 duration-200 z-50">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors">
              <User size={18} className="text-slate-400" />
              My Profile
            </button>
            <div className="h-px bg-slate-100 my-1 mx-2"></div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl text-sm font-bold transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}

        <div 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className={`group flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 cursor-pointer border ${
            isProfileOpen ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-slate-50 border-transparent hover:bg-slate-100'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
            isProfileOpen ? 'bg-slate-800 text-white' : 'bg-brand-100 text-brand-600'
          }`}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold truncate transition-colors ${isProfileOpen ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'User'}</p>
            <p className={`text-xs truncate capitalize transition-colors ${isProfileOpen ? 'text-slate-400' : 'text-slate-500'}`}>{user?.role || 'Guest'}</p>
          </div>
          <ChevronUp size={18} className={`transition-transform duration-300 ${isProfileOpen ? 'text-white rotate-180' : 'text-slate-400'}`} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
