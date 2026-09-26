import React from 'react';

const CategoryPicker = ({ value, onChange }) => {
  const categories = ['Electronics', 'Clothing', 'Food', 'Furniture', 'Tools'];

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
};

export default CategoryPicker;
