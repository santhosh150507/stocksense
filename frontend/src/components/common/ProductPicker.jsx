import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';

const ProductPicker = ({ value, onChange, className = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAll().then(setProducts).catch(console.error);
  }, []);

  return (
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className={className}
      required
    >
      <option value="" disabled>Select a product</option>
      {products.map(prod => (
        <option key={prod.id} value={prod.id}>{prod.name} ({prod.sku})</option>
      ))}
    </select>
  );
};

export default ProductPicker;
