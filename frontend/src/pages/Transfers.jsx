import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import { Plus, Eye, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const mockTransfers = [
  { id: 'TRF-001', source: 'Main Warehouse', destination: 'Production Floor', products: 1, totalQty: 100, date: '2026-09-24', status: 'Done' },
  { id: 'TRF-002', source: 'Warehouse 2', destination: 'Main Warehouse', products: 2, totalQty: 45, date: '2026-09-25', status: 'Draft' },
];

const Transfers = () => {
  const [transfers, setTransfers] = useState(mockTransfers);

  const handleValidate = (id) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, status: 'Done' } : t));
    toast.success('Transfer validated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Internal Transfers</h1>
          <p className="text-sm text-gray-500 mt-1">Move stock between your warehouse locations.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Transfer
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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transfer No</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Lines</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {transfers.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{t.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <ArrowRight className="w-3 h-3 text-gray-400 mr-2" />
                    {t.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{t.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{t.totalQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      {t.status === 'Draft' && (
                        <button onClick={() => handleValidate(t.id)} className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Confirm
                        </button>
                      )}
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

export default Transfers;
