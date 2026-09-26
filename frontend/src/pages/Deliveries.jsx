import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import { Plus, Eye, CheckCircle2, ChevronRight, Package, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const mockDeliveries = [
  { id: 'DEL-001', customer: 'BuildCo Construction', warehouse: 'Main Warehouse', products: 3, totalQty: 250, date: '2026-09-21', status: 'Done' },
  { id: 'DEL-002', customer: 'Retail Partners LLC', warehouse: 'Main Warehouse', products: 1, totalQty: 20, date: '2026-09-23', status: 'Waiting' },
  { id: 'DEL-003', customer: 'Direct Client', warehouse: 'Warehouse 2', products: 2, totalQty: 5, date: '2026-09-26', status: 'Draft' },
];

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState(mockDeliveries);

  const handleProgress = (id, currentStatus) => {
    let nextStatus = currentStatus;
    if (currentStatus === 'Draft') nextStatus = 'Waiting'; // Pick
    else if (currentStatus === 'Waiting') nextStatus = 'Ready'; // Pack
    else if (currentStatus === 'Ready') {
      nextStatus = 'Done'; // Validate
      toast.success('Delivery validated and stock deducted!');
    }
    
    setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: nextStatus } : d));
  };

  const getActionBtn = (status, id) => {
    if (status === 'Draft') return <button onClick={() => handleProgress(id, status)} className="text-indigo-600 hover:text-indigo-700 transition-colors flex items-center text-xs font-semibold"><Package className="w-4 h-4 mr-1" /> Pick</button>;
    if (status === 'Waiting') return <button onClick={() => handleProgress(id, status)} className="text-amber-600 hover:text-amber-700 transition-colors flex items-center text-xs font-semibold"><Package className="w-4 h-4 mr-1" /> Pack</button>;
    if (status === 'Ready') return <button onClick={() => handleProgress(id, status)} className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center text-xs font-semibold"><Truck className="w-4 h-4 mr-1" /> Deliver</button>;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Delivery Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage outgoing shipments to customers.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Delivery
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <FilterBar />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Delivery No</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Lines</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {deliveries.map(d => (
                <tr key={d.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{d.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{d.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{d.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{d.totalQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{d.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      {getActionBtn(d.status, d.id)}
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="text-gray-400 hover:text-gray-900 transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Deliveries;
