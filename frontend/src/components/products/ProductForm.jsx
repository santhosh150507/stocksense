import React, { useState } from 'react';
import CategoryPicker from './CategoryPicker';

const ProductForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '', sku: '', category: '', price: '', stock: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (category) => {
    setFormData({ ...formData, category });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-2">SKU</label>
        <input type="text" name="sku" value={formData.sku} onChange={handleChange} className="w-full p-2 border rounded" required />
      </div>
      <CategoryPicker value={formData.category} onChange={handleCategoryChange} />
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">Price ($)</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required min="0" step="0.01" />
        </div>
        <div className="flex-1">
          <label className="block text-gray-700 text-sm font-bold mb-2">Initial Stock</label>
          <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded" required min="0" />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Product</button>
      </div>
    </form>
  );
};

export default ProductForm;
