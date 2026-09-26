import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, ChevronDown } from 'lucide-react';

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 focus:outline-none p-1 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold border border-indigo-200">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-700 leading-tight">{user?.name || 'Admin User'}</span>
          <span className="text-xs text-gray-500 leading-tight">Warehouse Manager</span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
          <div className="px-4 py-3 border-b border-gray-100 mb-1">
            <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email || 'admin@stocksense.com'}</p>
          </div>
          <Link 
            to="/profile" 
            className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4 mr-3" />
            My Profile
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1 border-t border-gray-100 pt-2"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
