import React, { useState } from 'react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import AdjustmentForm from '../components/operations/AdjustmentForm';

const mockAdjustments = [
  { id: 'ADJ-001', product: 'Wireless Mouse', recordedQty: 50, countedQty: 48, delta: -2, date: '2026-09-21', status: 'Done' },
];

const Adjustments = () => {
  const [adjustments, setAdjustments] = useState(mockAdjustments);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (data) => {
    const newAdjustment = { id: `ADJ-00${adjustments.length + 1}`, ...data, date: new Date().toISOString().split('T')[0], status: 'Draft' };
    setAdjustments([newAdjustment, ...adjustments]);
    setIsModalOpen(false);
  };

  const handleValidate = (id) => {
    setAdjustments(adjustments.map(a => a.id === id ? { ...a, status: 'Done' } : a));
    alert('Adjustment validated and stock updated!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Adjustments</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Adjustment
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Delta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {adjustments.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{a.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{a.product}</td>
                <td className={`px-6 py-4 text-right text-sm font-bold ${a.delta > 0 ? 'text-green-600' : a.delta < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                  {a.delta > 0 ? `+${a.delta}` : a.delta}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{a.date}</td>
                <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                <td className="px-6 py-4 text-right text-sm">
                  {a.status === 'Draft' && (
                    <button onClick={() => handleValidate(a.id)} className="text-green-600 hover:underline">Validate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Inventory Adjustment">
        <AdjustmentForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Adjustments;
