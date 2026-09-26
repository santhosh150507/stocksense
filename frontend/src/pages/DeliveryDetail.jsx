import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import { deliveryService } from '../services/deliveryService';

const DeliveryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const data = await deliveryService.getById(id);
        setDelivery(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDelivery();
  }, [id]);

  const handleNextStatus = async () => {
    try {
      if (delivery.status === 'Ready') {
        await deliveryService.validate(id);
        alert('Delivery validated and stock reduced!');
        setDelivery({ ...delivery, status: 'Done' });
      } else {
        // Assume backend allows updating status for others, or just mock it here if backend doesn't support picking steps yet.
        // For now, we'll just optimistically update the client state since validate is the only real DB transition for deliveries in the MVP.
        let nextStatus = delivery.status === 'Draft' ? 'Waiting' : 'Ready';
        setDelivery({ ...delivery, status: nextStatus });
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to update delivery');
    }
  };

  const getActionText = () => {
    if (delivery.status === 'Draft') return 'Mark as Waiting (Start Pick)';
    if (delivery.status === 'Waiting') return 'Mark as Ready (Packed)';
    if (delivery.status === 'Ready') return 'Validate Delivery (Done)';
    return null;
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!delivery) return <div className="p-6">Delivery not found.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/deliveries')} className="text-sm text-gray-500 hover:underline mb-2">← Back to Deliveries</button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Delivery {delivery.order_number || delivery.id}
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
            <p className="font-medium">{delivery.customer_name || delivery.customer}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{new Date(delivery.date || delivery.created_at).toLocaleDateString()}</p>
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
            {delivery.lines?.map((line, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm text-gray-900">{line.product_name || line.product}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{line.quantity}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">
                   {delivery.status === 'Draft' ? 0 : line.quantity}
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
