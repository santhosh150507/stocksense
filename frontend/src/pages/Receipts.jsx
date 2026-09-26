import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import { Plus, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import ReceiptForm from '../components/operations/ReceiptForm';
import { receiptService } from '../services/receiptService';

const Receipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  React.useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      const data = await receiptService.getAll();
      setReceipts(data);
    } catch (err) {
      toast.error('Failed to load receipts');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      await receiptService.validate(id);
      toast.success('Receipt validated successfully');
      fetchReceipts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to validate receipt');
    }
  };

  const handleCreate = async (data) => {
    try {
      // Map the string inputs to IDs if the user types a number, defaulting to 1 for location if they didn't provide one
      const lines = data.lines.map(l => ({
        product_id: parseInt(l.product) || 1,
        location_id: parseInt(l.location) || 1, 
        quantity: parseInt(l.quantity)
      }));
      await receiptService.create({ supplier: data.supplier, lines });
      toast.success('Receipt created successfully');
      setIsModalOpen(false);
      fetchReceipts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create receipt');
    }
  };

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = !searchQuery || 
      (r.receipt_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.supplier_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusFilter || statusFilter === 'All Statuses' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Receipts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage incoming goods from your suppliers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Receipt
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <FilterBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
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
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">Loading receipts...</td></tr>
              ) : filteredReceipts.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No receipts found.</td></tr>
              ) : (
                filteredReceipts.map(r => (
                <tr key={r.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{r.receipt_number || r.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.supplier_name || r.supplier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.warehouse_name || r.warehouse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{r.line_count || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{r.total_qty || r.totalQty || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.date || r.created_at).toLocaleDateString()}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Receipt">
        <ReceiptForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Receipts;
