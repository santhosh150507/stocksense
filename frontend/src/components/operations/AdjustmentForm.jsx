import React, { useState } from 'react';

const AdjustmentForm = ({ onSubmit, onCancel }) => {
  const [product, setProduct] = useState('');
  const [recordedQty, setRecordedQty] = useState(0);
  const [countedQty, setCountedQty] = useState(0);

  const delta = countedQty - recordedQty;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ product, recordedQty, countedQty, delta });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
        <input type="text" value={product} onChange={e => setProduct(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Recorded Quantity (System)</label>
          <input type="number" min="0" value={recordedQty} onChange={e => setRecordedQty(Number(e.target.value))} className="w-full p-2 border rounded" required />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Counted Quantity (Physical)</label>
          <input type="number" min="0" value={countedQty} onChange={e => setCountedQty(Number(e.target.value))} className="w-full p-2 border rounded" required />
        </div>
      </div>
      <div className="p-4 bg-gray-50 border rounded-lg">
        <p className="text-sm text-gray-500">Auto-computed Delta (Adjustment)</p>
        <p className={`text-xl font-bold ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-800'}`}>
          {delta > 0 ? `+${delta}` : delta} units
        </p>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit Adjustment</button>
      </div>
    </form>
  );
};

export default AdjustmentForm;
