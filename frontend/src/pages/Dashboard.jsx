import React from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import FilterBar from '../components/dashboard/FilterBar';
import ActivityFeed from '../components/dashboard/ActivityFeed';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <FilterBar />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Products" value="1,245" color="blue" />
        <KpiCard title="Low/Out of Stock" value="23" color="red" />
        <KpiCard title="Pending Receipts" value="8" color="yellow" />
        <KpiCard title="Pending Deliveries" value="15" color="indigo" />
        <KpiCard title="Transfers Scheduled" value="3" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Recent Stock Movements</h2>
          <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
            Chart Placeholder
          </div>
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
