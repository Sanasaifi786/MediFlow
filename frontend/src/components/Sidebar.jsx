import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bot, Terminal, FileText, User, LogOut, ChevronUp, Package, UserPlus, ClipboardList, Loader2, KeyRound } from 'lucide-react';
import api from '../api';

const Sidebar = ({ isCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [isProfileDetailsLoading, setIsProfileDetailsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' });
  const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
  
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

  const fetchProfileDetails = async () => {
    try {
      setIsProfileDetailsLoading(true);
      const res = await api.get('/auth/me');
      setProfileDetails(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProfileDetailsLoading(false);
    }
  };

  const handleOpenProfileModal = () => {
    setIsProfileOpen(false);
    setIsProfileModalOpen(true);
    fetchProfileDetails();
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!passwordData.newPassword) {
      setPasswordStatus({ type: 'error', message: 'Please enter a new password.' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    try {
      setIsPasswordUpdating(true);
      setPasswordStatus({ type: '', message: '' });
      await api.post('/auth/reset-password', {
        email: profileDetails?.email,
        phone: profileDetails?.phone,
        newPassword: passwordData.newPassword
      });
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      setPasswordStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to reset password. Please try again.'
      });
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: Bot },
    ...(user?.role === 'doctor' ? [
      { name: 'Assistant', path: '/app/assistant', icon: Bot },
      { name: 'Logs', path: '/app/logs', icon: Terminal },
      { name: 'Report', path: '/app/reports', icon: FileText }
    ] : []),
    ...(user?.role === 'admin' ? [
      { name: 'Staff Management', path: '/app/staff', icon: UserPlus },
      { name: 'Reasoning Logs', path: '/app/logs', icon: Terminal },
      { name: 'System Prompts', path: '/app/prompts', icon: Bot }
    ] : []),
    ...(user?.role === 'nurse' ? [
      { name: 'Patient Logs', path: '/app/nurse', icon: ClipboardList }
    ] : []),
    ...(user?.role === 'insurance_manager' ? [
      { name: 'Assistant', path: '/app/assistant', icon: Bot },
      { name: 'Claims', path: '/app/claims', icon: FileText }
    ] : []),
    ...(user?.role === 'inventory_manager' ? [
      { name: 'Assistant', path: '/app/assistant', icon: Bot },
      { name: 'Inventory', path: '/app/inventory', icon: Package }
    ] : []),
    ...(user?.role === 'receptionist' ? [
      { name: 'Patient Registration', path: '/app/receptionist', icon: ClipboardList }
    ] : [])
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
              <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">{user?.role ? `${user.role} Portal` : 'Portal'}</p>
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
              `flex items-center rounded-2xl transition-all duration-300 overflow-hidden ${isCollapsed ? 'justify-center p-4' : 'gap-5 px-6 py-4'
              } ${isActive
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
            <button 
              onClick={handleOpenProfileModal}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-bold transition-colors"
            >
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
          className={`group flex items-center transition-all duration-500 cursor-pointer border ${isCollapsed
            ? 'justify-center p-3 rounded-xl border-transparent hover:bg-slate-100'
            : `p-4 rounded-2xl gap-3 ${isProfileOpen ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`
            }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 transition-colors ${isProfileOpen ? 'bg-slate-800 text-white' : 'bg-brand-100 text-brand-600'
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

      {/* Modern High-End Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-300">
          <div className="bg-white max-w-lg w-full rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 flex flex-col gap-6 relative animate-in zoom-in-95 duration-300">
            
            {/* Close button */}
            <button 
              onClick={() => {
                setIsProfileModalOpen(false);
                setPasswordStatus({ type: '', message: '' });
                setPasswordData({ newPassword: '', confirmPassword: '' });
              }}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <User className="text-brand-600" size={26} />
                Profile Secure Details
              </h2>
              <p className="text-xs text-slate-500 font-medium">View professional credentials and update your account password.</p>
            </div>

            {isProfileDetailsLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400 text-sm font-bold">
                <Loader2 className="animate-spin text-brand-600" size={32} />
                Loading direct credentials...
              </div>
            ) : profileDetails ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Full Name</p>
                    <p className="text-base font-black text-slate-800">{profileDetails.name}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Role / Status</p>
                    <p className="text-base font-black text-slate-800 capitalize">{profileDetails.role}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-base font-bold text-slate-800">{profileDetails.email}</p>
                  </div>
                  {profileDetails.department && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Department</p>
                      <p className="text-base font-bold text-slate-800 truncate">{profileDetails.department}</p>
                    </div>
                  )}
                  {profileDetails.phone && (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Contact Number</p>
                      <p className="text-base font-bold text-slate-800 truncate">{profileDetails.phone}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h3 className="text-sm font-black text-slate-900 tracking-tight uppercase tracking-wider flex items-center gap-2">
                    <KeyRound size={16} className="text-brand-600" />
                    Reset Access Password
                  </h3>
                  
                  {passwordStatus.message && (
                    <div className={`p-3 text-xs font-bold rounded-2xl animate-in slide-in-from-top-1 ${
                      passwordStatus.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {passwordStatus.message}
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-3">
                    <div>
                      <input 
                        type="password"
                        placeholder="Enter New Access Password"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium text-sm transition-all"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div>
                      <input 
                        type="password"
                        placeholder="Confirm Access Password"
                        required
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-500 font-medium text-sm transition-all"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isPasswordUpdating || !passwordData.newPassword}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-slate-100 disabled:opacity-50"
                    >
                      {isPasswordUpdating ? <Loader2 className="animate-spin" size={18} /> : null}
                      Save Password
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 font-medium py-6">Could not load secure profile data.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
