import React, { useState } from 'react';
import KpiCard from '../components/dashboard/KpiCard';
import FilterBar from '../components/dashboard/FilterBar';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import { Package, AlertTriangle, AlertOctagon, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const summary = await dashboardService.getSummary();
        setData(summary);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium tracking-wide animate-pulse">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load dashboard. Make sure the backend is running.</div>;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your current stock and operations.</p>
        </div>
        <FilterBar />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Products" value={data.kpis.totalProducts} color="blue" icon={Package} />
        <KpiCard title="Low Stock Items" value={data.kpis.lowStock} color="yellow" icon={AlertTriangle} />
        <KpiCard title="Out of Stock" value={data.kpis.outOfStock} color="red" icon={AlertOctagon} />
        <KpiCard title="Pending Receipts" value={data.kpis.pendingReceipts} color="emerald" icon={ArrowDownToLine} />
        <KpiCard title="Pending Deliveries" value={data.kpis.pendingDeliveries} color="indigo" icon={ArrowUpFromLine} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-base font-semibold mb-6 text-gray-900">Stock Movements (Last 7 Days)</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.movementData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dx={-10} />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '13px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="In" name="Incoming" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Out" name="Outgoing" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-base font-semibold text-gray-900">Low Stock Products</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Reorder Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {data.stockAlerts.lowStock.length === 0 && data.stockAlerts.outOfStock.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">
                        No low stock items currently.
                      </td>
                    </tr>
                  ) : (
                    [...data.stockAlerts.outOfStock, ...data.stockAlerts.lowStock].slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${item.currentStock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                          {item.currentStock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{item.reorderPoint}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 h-full min-h-[600px]">
          <ActivityFeed activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
