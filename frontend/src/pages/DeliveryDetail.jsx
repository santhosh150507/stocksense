import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';

const DeliveryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Mock data for detail
  const [delivery, setDelivery] = useState({
    id,
    customer: 'Acme Corp',
    date: '2026-09-26',
    status: 'Draft', // Draft -> Waiting -> Ready -> Done
    lines: [
      { product: 'Wireless Mouse', quantity: 15, picked: 0 },
      { product: 'Keyboard', quantity: 5, picked: 0 },
    ]
  });

  const handleNextStatus = () => {
    let nextStatus = '';
    if (delivery.status === 'Draft') nextStatus = 'Waiting';
    else if (delivery.status === 'Waiting') nextStatus = 'Ready';
    else if (delivery.status === 'Ready') nextStatus = 'Done';
    
    if (nextStatus) {
      if (nextStatus === 'Done') {
        alert('Delivery validated and stock reduced!');
      }
      setDelivery({ ...delivery, status: nextStatus });
    }
  };

  const getActionText = () => {
    if (delivery.status === 'Draft') return 'Mark as Waiting (Start Pick)';
    if (delivery.status === 'Waiting') return 'Mark as Ready (Packed)';
    if (delivery.status === 'Ready') return 'Validate Delivery (Done)';
    return null;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/deliveries')} className="text-sm text-gray-500 hover:underline mb-2">← Back to Deliveries</button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Delivery {delivery.id}
            <StatusBadge status={delivery.status} />
          </h1>
        </div>
        {getActionText() && (
          <button onClick={handleNextStatus} className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700">
            {getActionText()}
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{delivery.customer}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{delivery.date}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Product Lines (Pick/Pack)</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty Required</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty Picked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {delivery.lines.map((line, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm text-gray-900">{line.product}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{line.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                   {delivery.status === 'Draft' ? 0 : line.quantity} {/* Auto mock picking */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryDetail;
