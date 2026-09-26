import React, { useState } from 'react';
import CategoryPicker from './CategoryPicker';

const ProductForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unit: 'PCS',
    initialStock: 0,
    reorderLevel: 0,
    warehouse: 'Main Warehouse'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Name <span className="text-red-500">*</span></label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g. Steel Rods" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU / Code <span className="text-red-500">*</span></label>
          <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="SR001" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
          <CategoryPicker value={formData.category} onChange={val => setFormData({...formData, category: val})} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
          <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="PCS">Pieces (PCS)</option>
            <option value="KG">Kilograms (KG)</option>
            <option value="L">Liters (L)</option>
            <option value="BOX">Boxes (BOX)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse Location</label>
          <select value={formData.warehouse} onChange={e => setFormData({...formData, warehouse: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="Main Warehouse">Main Warehouse</option>
            <option value="Production Floor">Production Floor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
          <input type="number" min="0" value={formData.initialStock} onChange={e => setFormData({...formData, initialStock: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
          <input type="number" min="0" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: Number(e.target.value)})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
          <p className="mt-1 text-xs text-gray-500">Alert triggers below this amount.</p>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-5 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-indigo-600 border border-transparent text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Save Product
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
