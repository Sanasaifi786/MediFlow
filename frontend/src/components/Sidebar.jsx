import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Terminal, FileText, User, LogOut, ChevronUp } from 'lucide-react';

const Sidebar = ({ isCollapsed }) => {
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
    <div className="h-full flex flex-col transition-all duration-500 overflow-hidden">
      {/* Header */}
      <div className={`p-8 transition-all duration-500 ${isCollapsed ? 'px-4' : 'px-10'}`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-medical-500 flex items-center justify-center text-white shadow-xl shadow-brand-100 flex-shrink-0">
            <Bot size={28} />
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">MediFlow</h1>
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">Doctor Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-4 transition-all duration-500 ${isCollapsed ? 'px-2' : 'px-6'}`}>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center rounded-2xl transition-all duration-300 overflow-hidden ${
                isCollapsed ? 'justify-center p-4' : 'gap-5 px-6 py-4'
              } ${
                isActive
                  ? 'bg-brand-50 text-brand-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={`flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                {!isCollapsed && (
                  <span className="font-bold text-base tracking-wide animate-in fade-in slide-in-from-left-4 duration-500">
                    {item.name}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className={`p-4 mt-auto border-t border-slate-100 relative transition-all duration-500 ${isCollapsed ? 'px-2' : 'px-6 py-6'}`}>
        {/* Profile Dropdown Card */}
        {isProfileOpen && !isCollapsed && (
          <div className="absolute bottom-28 left-6 right-6 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 animate-in slide-in-from-bottom-2 duration-200 z-50">
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
          onClick={() => !isCollapsed && setIsProfileOpen(!isProfileOpen)}
          className={`group flex items-center transition-all duration-500 cursor-pointer border ${
            isCollapsed 
              ? 'justify-center p-3 rounded-xl border-transparent hover:bg-slate-100' 
              : `p-4 rounded-2xl gap-3 ${isProfileOpen ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
            isProfileOpen ? 'bg-slate-800 text-white' : 'bg-brand-100 text-brand-600'
          }`}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-4 duration-500">
              <p className={`text-sm font-bold truncate transition-colors ${isProfileOpen ? 'text-white' : 'text-slate-900'}`}>{user?.name || 'Dr. Smith'}</p>
              <p className={`text-[10px] truncate capitalize transition-colors ${isProfileOpen ? 'text-slate-400' : 'text-slate-500'}`}>{user?.role || 'Cardiologist'}</p>
            </div>
          )}
          {!isCollapsed && (
            <ChevronUp size={18} className={`transition-transform duration-300 ${isProfileOpen ? 'text-white rotate-180' : 'text-slate-400'}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
