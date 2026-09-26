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
        className={`flex items-center px-3 py-2.5 mt-1 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm group ${
          isActive 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
        {label}
      </NavLink>
    );
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 shrink-0">
        <Link to="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
            <Box className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Stock<span className="text-indigo-600">Sense</span></span>
        </Link>
        <button className="lg:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" onClick={onClose}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-4 space-y-8 scrollbar-thin">
        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Overview</div>
          {mainLinks.map(link => <NavItem key={link.path} to={link.path} label={link.label} icon={link.icon} />)}
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Operations</div>
          {operationsLinks.map(link => <NavItem key={link.path} to={link.path} label={link.label} icon={link.icon} />)}
        </div>

        <div>
          <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</div>
          {settingsLinks.map(link => <NavItem key={link.path} to={link.path} label={link.label} icon={link.icon} />)}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 shrink-0 bg-gray-50/50">
        {(() => {
          const isActive = location.pathname.startsWith('/profile');
          return (
            <NavLink
              to="/profile"
              onClick={onClose}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out font-medium text-sm group ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-gray-900 border border-transparent hover:border-gray-200'
              }`}
            >
              <Settings className={`w-5 h-5 mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
              Profile & Settings
            </NavLink>
          );
        })()}
      </div>
    </div>
  );
};

export default Sidebar;
