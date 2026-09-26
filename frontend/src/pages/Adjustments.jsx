import React, { useState } from 'react';
import FilterBar from '../components/dashboard/FilterBar';
import StatusBadge from '../components/common/StatusBadge';
import { Plus, Eye, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import AdjustmentForm from '../components/operations/AdjustmentForm';
import { adjustmentService } from '../services/adjustmentService';

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  React.useEffect(() => {
    fetchAdjustments();
  }, []);

  const fetchAdjustments = async () => {
    try {
      const data = await adjustmentService.getAll();
      setAdjustments(data);
    } catch (err) {
      toast.error('Failed to fetch adjustments');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      await adjustmentService.validate(id);
      toast.success('Adjustment validated and stock updated');
      fetchAdjustments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to validate adjustment');
    }
  };

  const handleCreate = async (data) => {
    try {
      await adjustmentService.create({ 
        location_id: parseInt(data.location) || 1, 
        product_id: parseInt(data.product) || 1,
        recorded_qty: parseInt(data.recordedQty) || 0,
        counted_qty: parseInt(data.countedQty),
        delta: parseInt(data.countedQty) - (parseInt(data.recordedQty) || 0),
        reason: data.reason
      });
      toast.success('Adjustment created successfully');
      setIsModalOpen(false);
      fetchAdjustments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create adjustment');
    }
  };

  const filteredAdjustments = adjustments.filter(a => {
    const matchesSearch = !searchQuery || 
      (a.adjustment_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.product_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !statusFilter || statusFilter === 'All Statuses' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Adjustments</h1>
          <p className="text-sm text-gray-500 mt-1">Correct differences between recorded and physical stock.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Adjustment
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
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Adj No</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Warehouse</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Sys Qty</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Phys Qty</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Delta</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500">Loading adjustments...</td></tr>
              ) : filteredAdjustments.length === 0 ? (
                <tr><td colSpan="9" className="px-6 py-8 text-center text-sm text-gray-500 font-medium">No adjustments found.</td></tr>
              ) : (
                filteredAdjustments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-indigo-600 cursor-pointer hover:text-indigo-800">{a.adjustment_number}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{a.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{a.warehouse_name} ({a.location_code})</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{a.recorded_qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">{a.counted_qty}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${a.delta > 0 ? 'bg-emerald-50 text-emerald-700' : a.delta < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {a.delta > 0 ? `+${a.delta}` : a.delta}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{a.reason}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-3">
                      {a.status === 'Draft' && (
                        <button onClick={() => handleValidate(a.id)} className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Validate
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-indigo-600 transition-colors"><Eye className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Stock Adjustment">
        <AdjustmentForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Adjustments;
