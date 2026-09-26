import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';

const mockLedger = [
  { id: 'MOV-1001', docType: 'Receipt', docId: 'REC-001', product: 'Wireless Mouse', qty: '+50', date: '2026-09-20', location: 'Main WH' },
  { id: 'MOV-1002', docType: 'Delivery', docId: 'DEL-001', product: 'Keyboard', qty: '-5', date: '2026-09-22', location: 'Main WH' },
  { id: 'MOV-1003', docType: 'Transfer', docId: 'TRF-001', product: 'Office Chair', qty: '-2', date: '2026-09-24', location: 'Main WH' },
  { id: 'MOV-1004', docType: 'Transfer', docId: 'TRF-001', product: 'Office Chair', qty: '+2', date: '2026-09-24', location: 'Secondary WH' },
  { id: 'MOV-1005', docType: 'Adjustment', docId: 'ADJ-001', product: 'Wireless Mouse', qty: '-2', date: '2026-09-21', location: 'Main WH' },
];

const Ledger = () => {
  const [movements, setMovements] = useState(mockLedger);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Stock Ledger</h1>
        <FilterBar />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Movement ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {movements.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="font-medium mr-2">{m.docType}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{m.docId}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{m.product}</td>
                <td className={`px-6 py-4 text-right text-sm font-bold ${m.qty.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {m.qty}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{m.location}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{m.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ledger;
