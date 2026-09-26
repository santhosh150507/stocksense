import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/common/StatusBadge';
import { receiptService } from '../services/receiptService';

const ReceiptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const data = await receiptService.getById(id);
        setReceipt(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [id]);

  const handleValidate = async () => {
    try {
      await receiptService.validate(id);
      setReceipt({ ...receipt, status: 'Done' });
      alert('Receipt validated and stock updated!');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || 'Failed to validate receipt');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!receipt) return <div className="p-6">Receipt not found.</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/receipts')} className="text-sm text-gray-500 hover:underline mb-2">← Back to Receipts</button>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            Receipt {receipt.receipt_number || receipt.id}
            <StatusBadge status={receipt.status} />
          </h1>
        </div>
        {receipt.status === 'Draft' && (
          <button onClick={handleValidate} className="bg-green-600 text-white px-4 py-2 rounded font-medium hover:bg-green-700">
            Validate Receipt
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Supplier</p>
            <p className="font-medium">{receipt.supplier_name || receipt.supplier}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{new Date(receipt.date || receipt.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-4">Product Lines</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {receipt.lines?.map((line, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-sm text-gray-900">{line.product_name || line.product}</td>
                <td className="px-6 py-4 text-sm text-gray-900 text-right">{line.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReceiptDetail;
