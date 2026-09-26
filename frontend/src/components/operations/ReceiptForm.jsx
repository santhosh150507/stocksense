import React, { useState } from 'react';
import ProductPicker from '../common/ProductPicker';
import LocationPicker from '../common/LocationPicker';

const ReceiptForm = ({ onSubmit, onCancel }) => {
  const [supplier, setSupplier] = useState('');
  const [lines, setLines] = useState([{ product: '', location: '', quantity: 1 }]);

  const handleAddLine = () => setLines([...lines, { product: '', location: '', quantity: 1 }]);
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
    onSubmit({ supplier, lines });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
        <input type="text" value={supplier} onChange={e => setSupplier(e.target.value)} className="w-full p-2 border rounded" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Lines</label>
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2 mb-2 items-center">
            <div className="flex-1">
              <ProductPicker value={line.product} onChange={val => handleLineChange(idx, 'product', val)} className="w-full p-2 border rounded" />
            </div>
            <div className="flex-1">
              <LocationPicker value={line.location} onChange={val => handleLineChange(idx, 'location', val)} className="w-full p-2 border rounded" />
            </div>
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
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create Receipt</button>
      </div>
    </form>
  );
};

export default ReceiptForm;
