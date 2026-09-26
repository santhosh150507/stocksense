import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
  SlidersHorizontal,
  BookOpen,
  Building2,
  Tags,
  Settings,
  X,
  Box
} from 'lucide-react';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const mainLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/products', label: 'Products', icon: Package },
  ];

  const operationsLinks = [
    { path: '/receipts', label: 'Receipts', icon: ArrowDownToLine },
    { path: '/deliveries', label: 'Deliveries', icon: ArrowUpFromLine },
    { path: '/transfers', label: 'Transfers', icon: ArrowRightLeft },
    { path: '/adjustments', label: 'Adjustments', icon: SlidersHorizontal },
    { path: '/ledger', label: 'Stock Ledger', icon: BookOpen },
  ];

  const settingsLinks = [
    { path: '/settings/warehouses', label: 'Warehouses', icon: Building2 },
    { path: '/settings/categories', label: 'Categories', icon: Tags },
  ];

  const NavItem = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <NavLink
        to={to}
        onClick={onClose}
        className={`flex items-center px-3 py-2.5 mt-1 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm group ${isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
          }`}
      >
        <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
        {label}
      </NavLink>
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#0B1120] border-r border-slate-800/50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 shrink-0">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Stock<span className="text-blue-500">Sense</span></span>
        </Link>
        <button className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-4 space-y-8 scrollbar-thin">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Overview</div>
          {mainLinks.map(link => <NavItem key={link.path} to={link.path} label={link.label} icon={link.icon} />)}
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Operations</div>
          {operationsLinks.map(link => <NavItem key={link.path} to={link.path} label={link.label} icon={link.icon} />)}
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Settings</div>
          {settingsLinks.map(link => <NavItem key={link.path} to={link.path} label={link.label} icon={link.icon} />)}
        </div>
      </div>

      <div className="p-4 border-t border-slate-800 shrink-0 bg-[#0B1120]">
        {(() => {
          const isActive = location.pathname.startsWith('/profile');
          return (
            <NavLink
              to="/profile"
              onClick={onClose}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm group ${isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                }`}
            >
              <Settings className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              Profile & Settings
            </NavLink>
          );
        })()}
      </div>
    </div>
  );
};

export default Sidebar;
