import React, { useState } from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import ProfileMenu from './ProfileMenu';
import { useLocation } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/receipts')) return 'Receipts';
    if (path.startsWith('/deliveries')) return 'Delivery Orders';
    if (path.startsWith('/transfers')) return 'Internal Transfers';
    if (path.startsWith('/adjustments')) return 'Stock Adjustments';
    if (path === '/ledger') return 'Stock Ledger';
    if (path.startsWith('/settings/warehouses')) return 'Warehouses';
    if (path.startsWith('/settings/categories')) return 'Categories';
    if (path === '/profile') return 'My Profile';
    return 'StockSense';
  };

  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0 shadow-sm">
      <div className="flex items-center flex-1 gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-gray-500 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-gray-800 hidden sm:block tracking-tight">{getPageTitle()}</h1>
        
        {/* Search */}
        <div className={`hidden md:flex items-center max-w-md w-full ml-12 transition-all duration-200 ease-in-out ${searchFocused ? 'ring-2 ring-indigo-500/20 rounded-lg' : ''}`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className={`h-4 w-4 ${searchFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50/50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-500 sm:text-sm transition-colors"
              placeholder="Search products, SKUs, or documents..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Navbar;
