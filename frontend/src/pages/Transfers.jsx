import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import { Plus, Eye, CheckCircle2, ChevronRight, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import TransferForm from '../components/operations/TransferForm';
import { transferService } from '../services/transferService';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  React.useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const data = await transferService.getAll();
      setTransfers(data);
    } catch (err) {
      toast.error('Failed to fetch transfers');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      await transferService.validate(id);
      toast.success('Transfer validated successfully');
      fetchTransfers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to validate transfer');
    }
  };

  const handleCreate = async (data) => {
    try {
      await transferService.create({ 
        from_location_id: parseInt(data.fromLocation) || 1, 
        to_location_id: parseInt(data.toLocation) || 2,
        product_id: parseInt(data.product) || 1,
        quantity: parseInt(data.quantity)
      });
      toast.success('Transfer created successfully');
      setIsModalOpen(false);
      fetchTransfers();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create transfer');
    }
  };

  const filteredTransfers = transfers.filter(t => {
    const matchesSearch = !searchQuery || 
      (t.transfer_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.product_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusFilter || statusFilter === 'All Statuses' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Internal Transfers</h1>
          <p className="text-sm text-gray-500 mt-1">Move stock between your warehouse locations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Transfer
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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transfer No</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Destination</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">Loading transfers...</td></tr>
              ) : filteredTransfers.length === 0 ? (
                <tr><td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No transfers found.</td></tr>
              ) : (
                filteredTransfers.map(t => (
                <tr key={t.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{t.transfer_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.from_warehouse_name} ({t.from_location_code})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                    <ArrowRight className="w-3 h-3 text-gray-400 mr-2" />
                    {t.to_warehouse_name} ({t.to_location_code})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{t.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{t.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Internal Transfer">
        <TransferForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Transfers;
