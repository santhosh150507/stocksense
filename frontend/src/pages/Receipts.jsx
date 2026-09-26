import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ReceiptForm from '../components/operations/ReceiptForm';
import { receiptService } from '../services/receiptService';

const mockReceipts = [
  { id: 'REC-001', supplier: 'Tech Corp', date: '2026-09-20', status: 'Done' },
  { id: 'REC-002', supplier: 'Office Supplies Inc', date: '2026-09-25', status: 'Draft' },
];

const Receipts = () => {
  const [receipts, setReceipts] = useState(mockReceipts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      // Mocking API call for frontend development
      // const newReceipt = await receiptService.create(data);
      const newReceipt = { id: `REC-00${receipts.length + 1}`, ...data, date: new Date().toISOString().split('T')[0], status: 'Draft' };
      setReceipts([newReceipt, ...receipts]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create receipt", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Receipts</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Receipt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {receipts.map(r => (
              <tr key={r.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/receipts/${r.id}`)}>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{r.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{r.supplier}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.date}</td>
                <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link to={`/receipts/${r.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Receipt">
        <ReceiptForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Receipts;
