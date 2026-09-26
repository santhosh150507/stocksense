import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, Bell, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-64 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50 p-4">
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'personal' ? 'bg-white text-indigo-700 shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <User className={`w-4 h-4 mr-3 ${activeTab === 'personal' ? 'text-indigo-600' : 'text-gray-400'}`} />
              Personal Info
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-white text-indigo-700 shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Lock className={`w-4 h-4 mr-3 ${activeTab === 'security' ? 'text-indigo-600' : 'text-gray-400'}`} />
              Security
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-white text-indigo-700 shadow-sm border border-gray-100' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <Bell className={`w-4 h-4 mr-3 ${activeTab === 'notifications' ? 'text-indigo-600' : 'text-gray-400'}`} />
              Notifications
            </button>
          </nav>
        </div>
        
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'personal' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold border border-indigo-200">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <button type="button" className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                    Change Avatar
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" defaultValue={user?.email} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input type="text" defaultValue="Warehouse Manager" disabled className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg sm:text-sm cursor-not-allowed" />
              </div>
              
              <div className="pt-4">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" />
              </div>
              <div className="pt-4">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Update Password
                </button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="low_stock" type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="low_stock" className="font-medium text-gray-900">Low Stock Alerts</label>
                    <p className="text-gray-500">Get notified when a product falls below its reorder level.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input id="receipts" type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="receipts" className="font-medium text-gray-900">Pending Receipts</label>
                    <p className="text-gray-500">Get daily summaries of receipts waiting for validation.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Save Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
