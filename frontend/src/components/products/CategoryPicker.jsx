import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

const CategoryPicker = ({ value, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      required
    >
      <option value="" disabled>Select a category</option>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>{cat.name}</option>
      ))}
    </select>
  );
};

export default CategoryPicker;
