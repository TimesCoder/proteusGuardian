import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  FileText,
  Server,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const location = useLocation();
  
  // State untuk Mobile (Buka/Tutup Overlay)
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // State untuk Desktop (Expand/Collapse Mini Sidebar)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  // Tutup sidebar mobile otomatis saat pindah halaman
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  return (
    <div className="flex h-screen bg-dark-900 text-white font-sans overflow-hidden">

      {/* --- 1. MOBILE OVERLAY BACKDROP --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- 2. SIDEBAR --- */}
      <aside
        className={`
          fixed md:relative z-50 h-full bg-dark-800 border-r border-dark-700
          flex flex-col transition-all duration-300 ease-in-out
          
          /* Mobile Logic */
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          
          /* Width Logic */
          ${isDesktopCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        {/* HEADER SIDEBAR (Logo & Toggle) */}
        {/* PERBAIKAN DI SINI: Logo dipisah dari Text agar tetap muncul */}
        <div 
  className={`
    h-16 flex items-center border-b border-dark-700/50 transition-all duration-300
    ${isDesktopCollapsed ? 'justify-center px-0' : 'justify-start px-4'}
  `}
>
  
  <div 
    className={`
      flex items-center overflow-hidden whitespace-nowrap transition-all duration-300
      ${isDesktopCollapsed ? 'gap-0' : 'gap-3'}
    `}
  >
    
    {/* 1. GAMBAR LOGO */}
    <div className="w-8 h-8 shrink-0 bg-accent-cyan rounded-lg flex items-center justify-center font-bold text-black shadow-lg shadow-cyan-500/20">
      <img src="/Logo.svg" alt="Logo" className="w-full h-full object-contain" />
    </div>
            {/* 2. TEKS JUDUL (Hilang saat Collapsed) */}
            <span 
              className={`font-bold text-lg tracking-wide transition-all duration-300 ${
                isDesktopCollapsed ? 'opacity-0 w-0 translate-x-10' : 'opacity-100 w-auto translate-x-0 '
              }`}
            >
              <i>Proteus</i>
               <i className='text-accent-cyan'> Guardian</i>
            </span>
          </div>

          {/* Tombol Close (Hanya di Mobile) */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-hide overflow-hidden">
          <NavItem 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isActive={location.pathname === '/'}
            collapsed={isDesktopCollapsed}
          />
          <NavItem 
            to="/fleet" 
            icon={Server} 
            label="Machine Fleet" 
            isActive={location.pathname === '/fleet'}
            collapsed={isDesktopCollapsed}
          />
          <NavItem 
            to="/chat" 
            icon={MessageSquare} 
            label="Copilot Chat" 
            isActive={location.pathname === '/chat'}
            collapsed={isDesktopCollapsed}
          />
          <NavItem 
            to="/reports" 
            icon={FileText} 
            label="Reports" 
            isActive={location.pathname === '/reports'}
            collapsed={isDesktopCollapsed}
          />
        </nav>

        {/* FOOTER SIDEBAR */}
        <div className="p-3 border-t border-dark-700 bg-dark-800">
          <NavItem 
            to="/settings" 
            icon={Settings} 
            label="Settings" 
            isActive={location.pathname === '/settings'}
            collapsed={isDesktopCollapsed}
          />
          
          {/* Tombol Collapse (Hanya di Desktop) */}
          <button
            onClick={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
            className="hidden md:flex w-full items-center justify-center mt-2 p-2 text-gray-500 hover:text-white hover:bg-dark-700 rounded-lg transition-colors"
            title={isDesktopCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isDesktopCollapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
          </button>
        </div>
      </aside>

      {/* --- 3. MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* MOBILE HEADER */}
        <header className="md:hidden h-16 bg-dark-800 border-b bord er-dark-700 flex items-center px-4 justify-between shrink-0">
          <button onClick={() => setIsMobileOpen(true)} className="text-gray-300">
            <Menu size={24} />
          </button>
          <span className="font-semibold text-white"><i>Proteus <span className="text-accent-cyan">Guardian</span></i></span>
          <div className="w-6" /> 
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
};

// --- SUB COMPONENT: NAV ITEM ---
const NavItem = ({ to, icon: Icon, label, isActive, collapsed }) => {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
        ${isActive 
          ? 'bg-accent-cyan text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
          : 'text-gray-400 hover:bg-dark-700 hover:text-white'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon size={22} className={`shrink-0 ${isActive ? 'text-black' : ''}`} />
      
      {/* Teks Label (Disembunyikan via CSS jika collapsed) */}
      <span className={`whitespace-nowrap transition-all duration-200 ${collapsed ? 'hidden' : 'block'}`}>
        {label}
      </span>

      {/* Tooltip Hover saat Collapsed */}
      {collapsed && (
        <div className="absolute left-14 bg-dark-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-dark-600 shadow-xl">
          {label}
        </div>
      )}
    </Link>
  );
};

export default MainLayout;