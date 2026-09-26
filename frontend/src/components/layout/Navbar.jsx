import React from 'react';
import ProfileMenu from './ProfileMenu';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname.substring(1) || 'Dashboard';
  const title = path.charAt(0).toUpperCase() + path.slice(1);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="text-xl font-bold text-gray-800">{title}</div>
      <div className="flex items-center space-x-4">
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Navbar;
