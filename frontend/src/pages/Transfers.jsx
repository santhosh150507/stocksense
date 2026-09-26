import React, { useState } from 'react';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import TransferForm from '../components/operations/TransferForm';

const mockTransfers = [
  { id: 'TRF-001', fromWarehouse: 'Main WH', toWarehouse: 'Secondary WH', date: '2026-09-24', status: 'Done' },
];

const Transfers = () => {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (data) => {
    const newTransfer = { id: `TRF-00${transfers.length + 1}`, ...data, date: new Date().toISOString().split('T')[0], status: 'Draft' };
    setTransfers([newTransfer, ...transfers]);
    setIsModalOpen(false);
  };

  const handleValidate = (id) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, status: 'Done' } : t));
    alert('Transfer validated and stocks adjusted!');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transfers</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Transfer
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destination</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transfers.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{t.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{t.fromWarehouse}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{t.toWarehouse}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{t.date}</td>
                <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                <td className="px-6 py-4 text-right text-sm">
                  {t.status === 'Draft' && (
                    <button onClick={() => handleValidate(t.id)} className="text-green-600 hover:underline">Validate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Transfer">
        <TransferForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Transfers;
