import React, { useState } from 'react';

const TransferForm = ({ onSubmit, onCancel }) => {
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [lines, setLines] = useState([{ product: '', quantity: 1 }]);
  
  const warehouses = ['Main WH', 'Secondary WH', 'Store Front'];

  const handleAddLine = () => setLines([...lines, { product: '', quantity: 1 }]);
  const handleLineChange = (index, field, value) => {
    const newLines = [...lines];
    newLines[index][field] = value;
    setLines(newLines);
  };
  const handleRemoveLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ fromWarehouse, toWarehouse, lines });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">From Warehouse</label>
          <select value={fromWarehouse} onChange={e => setFromWarehouse(e.target.value)} className="w-full p-2 border rounded" required>
            <option value="">Select Origin</option>
            {warehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">To Warehouse</label>
          <select value={toWarehouse} onChange={e => setToWarehouse(e.target.value)} className="w-full p-2 border rounded" required>
            <option value="">Select Destination</option>
            {warehouses.map(wh => <option key={wh} value={wh}>{wh}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Lines</label>
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <input type="text" placeholder="Product SKU or Name" value={line.product} onChange={e => handleLineChange(idx, 'product', e.target.value)} className="flex-1 p-2 border rounded" required />
            <input type="number" min="1" value={line.quantity} onChange={e => handleLineChange(idx, 'quantity', Number(e.target.value))} className="w-24 p-2 border rounded" required />
            {lines.length > 1 && (
              <button type="button" onClick={() => handleRemoveLine(idx)} className="text-red-500 hover:text-red-700 font-bold px-2">X</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddLine} className="text-blue-600 text-sm mt-1">+ Add Line</button>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Transfer</button>
      </div>
    </form>
  );
};

export default TransferForm;
