import React from 'react';

const categories = ['Raw Materials', 'Furniture', 'Hardware', 'Finished Goods'];

const CategoryPicker = ({ value, onChange }) => {
  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required
    >
      <option value="" disabled>Select a category</option>
      {categories.map(cat => (
        <option key={cat} value={cat}>{cat}</option>
      ))}
    </select>
  );
};

export default CategoryPicker;
