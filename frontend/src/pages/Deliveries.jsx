import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import DeliveryForm from '../components/operations/DeliveryForm';

const mockDeliveries = [
  { id: 'DEL-001', customer: 'Acme Corp', date: '2026-09-22', status: 'Done' },
  { id: 'DEL-002', customer: 'Global Industries', date: '2026-09-26', status: 'Draft' },
];

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreate = (data) => {
    const newDelivery = { id: `DEL-00${deliveries.length + 1}`, ...data, date: new Date().toISOString().split('T')[0], status: 'Draft' };
    setDeliveries([newDelivery, ...deliveries]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deliveries</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + New Delivery
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {deliveries.map(d => (
              <tr key={d.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/deliveries/${d.id}`)}>
                <td className="px-6 py-4 text-sm font-medium text-blue-600">{d.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{d.customer}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{d.date}</td>
                <td className="px-6 py-4"><StatusBadge status={d.status} /></td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link to={`/deliveries/${d.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Delivery">
        <DeliveryForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Deliveries;
