import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  FileText,
  Server
} from 'lucide-react';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-900 text-white font-sans">

      {/* MOBILE HAMBURGER */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-dark-800 p-2 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-40 h-full
          bg-dark-800 border-r border-dark-700
          flex flex-col p-4
          transition-all duration-300
          ${open ? 'w-64' : 'w-16'}
          md:w-64
        `}
      >
        {/* LOGO */}
        <div className="mb-6 flex items-center justify-center md:justify-start">
          {open || window.innerWidth >= 768 ? (
            <img src="/Logo.svg" alt="Logo" className="w-15 h-13" />
          ) : (
            <img src="/Logo.svg" alt="Logo" className="w-8" />
          )}
        </div>

        {/* MENU */}
        <nav className="space-y-2 flex flex-col items-center md:items-stretch">
          <NavItem
            to="/"
            icon={LayoutDashboard}
            label="Dashboard"
            active={location.pathname === '/'}
            open={open}
          />
          <NavItem
            to="/fleet"
            icon={Server}
            label="Machine Fleet"
            active={location.pathname === '/fleet'}
            open={open}
          />
          <NavItem
            to="/chat"
            icon={MessageSquare}
            label="Copilot Chat"
            active={location.pathname === '/chat'}
            open={open}
          />
          <NavItem
            to="/reports"
            icon={FileText}
            label="Reports"
            active={location.pathname === '/reports'}
            open={open}
          />
        </nav>

        <div className="mt-auto pt-4 border-t border-dark-700 flex justify-center md:justify-start">
          <NavItem
            to="/settings"
            icon={Settings}
            label="Settings"
            open={open}
          />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className={`
          flex-1 bg-dark-900 overflow-y-auto p-4 md:p-6
          transition-all duration-300
          ml-16 md:ml-0
          ${open ? 'ml-64' : 'ml-16'}
          md:ml-0
        `}
      >
        {children}
      </main>

    </div>
  );
};

// NAV ITEM (SUPPORT MINI MODE)
const NavItem = ({ to, icon: Icon, label, active, open }) => (
  <Link
    to={to}
    className={`
      group flex items-center gap-3 p-3 rounded-lg transition-all w-full justify-center md:justify-start
      ${active
        ? 'bg-accent-cyan/10 text-accent-cyan'
        : 'text-gray-400 hover:bg-dark-700 hover:text-white'}
    `}
  >
    <Icon size={20} />

    {(open || window.innerWidth >= 768) && (
      <span className="text-sm font-medium">{label}</span>
    )}

    {/* TOOLTIP SAAT MINI */}
    {!open && (
      <span className="
        absolute left-16 bg-dark-700 text-xs px-2 py-1 rounded
        opacity-0 group-hover:opacity-100 transition
        whitespace-nowrap md:hidden
      ">
        {label}
      </span>
    )}
  </Link>
);

export default MainLayout;
