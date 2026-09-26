import React from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import { Download } from 'lucide-react';

const mockLedger = [
  { id: 'MOV-1001', docType: 'Receipt', docId: 'REC-001', product: 'Wireless Mouse', qty: '+50', prevStock: 100, newStock: 150, date: '2026-09-20', location: 'Main Warehouse', user: 'Admin' },
  { id: 'MOV-1002', docType: 'Delivery', docId: 'DEL-001', product: 'Keyboard', qty: '-5', prevStock: 150, newStock: 145, date: '2026-09-22', location: 'Main Warehouse', user: 'Admin' },
  { id: 'MOV-1003', docType: 'Transfer', docId: 'TRF-001', product: 'Office Chair', qty: '-2', prevStock: 15, newStock: 13, date: '2026-09-24', location: 'Main Warehouse', user: 'Admin' },
  { id: 'MOV-1004', docType: 'Transfer', docId: 'TRF-001', product: 'Office Chair', qty: '+2', prevStock: 0, newStock: 2, date: '2026-09-24', location: 'Production Floor', user: 'Admin' },
  { id: 'MOV-1005', docType: 'Adjustment', docId: 'ADJ-001', product: 'Wireless Mouse', qty: '-2', prevStock: 50, newStock: 48, date: '2026-09-21', location: 'Main Warehouse', user: 'Admin' },
];

const Ledger = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Stock Ledger</h1>
          <p className="text-sm text-gray-500 mt-1">Complete history of all stock movements.</p>
        </div>
        <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Operation Type</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Prev Stock</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">New Stock</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {mockLedger.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{m.docId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{m.docType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${m.qty.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      {m.qty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{m.prevStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-right">{m.newStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
