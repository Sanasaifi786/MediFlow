import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 transition-all duration-500 ease-in-out">
      {/* Sidebar Container */}
      <div 
        className={`transition-all duration-500 ease-in-out border-r border-slate-200 bg-white relative ${
          isCollapsed ? 'w-[80px]' : 'w-[30%]'
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} />
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-10 w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all z-[100] border-2 border-white"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main 
        className={`transition-all duration-500 ease-in-out p-8 overflow-y-auto ${
          isCollapsed ? 'w-[calc(100%-80px)]' : 'w-[70%]'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
