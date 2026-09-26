import React from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import { Download } from 'lucide-react';

import { ledgerService } from '../services/ledgerService';

const Ledger = () => {
  const [ledger, setLedger] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchLedger();
  }, []);

  const fetchLedger = async () => {
    try {
      const data = await ledgerService.getAll();
      setLedger(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">Loading ledger...</td></tr>
              ) : ledger.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No ledger entries yet.</td></tr>
              ) : (
                ledger.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{m.docId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 capitalize">{m.entryType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.location || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${m.qtyDelta > 0 ? 'bg-emerald-50 text-emerald-700' : m.qtyDelta < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {m.qtyDelta > 0 ? `+${m.qtyDelta}` : m.qtyDelta}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.user}</td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ledger;
