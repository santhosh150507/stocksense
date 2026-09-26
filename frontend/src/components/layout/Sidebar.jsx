import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/receipts', label: 'Receipts' },
    { path: '/deliveries', label: 'Deliveries' },
    { path: '/transfers', label: 'Transfers' },
    { path: '/adjustments', label: 'Adjustments' },
    { path: '/ledger', label: 'Ledger' },
    { path: '/warehouses', label: 'Warehouses' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col shadow-xl">
      <div className="p-6 text-2xl font-black border-b border-gray-800 tracking-wider">
        <span className="text-blue-500">Stock</span>Sense
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600 text-white font-medium' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
