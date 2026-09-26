import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import { Plus, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const mockReceipts = [
  { id: 'REC-001', supplier: 'ABC Steel', warehouse: 'Main Warehouse', products: 2, totalQty: 150, date: '2026-09-20', status: 'Done' },
  { id: 'REC-002', supplier: 'Global Metals', warehouse: 'Production Floor', products: 1, totalQty: 50, date: '2026-09-22', status: 'Draft' },
  { id: 'REC-003', supplier: 'Office Supplies Inc', warehouse: 'Warehouse 2', products: 5, totalQty: 100, date: '2026-09-25', status: 'Waiting' },
];

const Receipts = () => {
  const [receipts, setReceipts] = useState(mockReceipts);

  const handleValidate = (id) => {
    setReceipts(receipts.map(r => r.id === id ? { ...r, status: 'Done' } : r));
    toast.success('Receipt validated successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Receipts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage incoming goods from your suppliers.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Receipt
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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Receipt No</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Lines</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Qty</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {receipts.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{r.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{r.products}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{r.totalQty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      {r.status === 'Draft' && (
                        <button onClick={() => handleValidate(r.id)} className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Validate
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

export default Receipts;
