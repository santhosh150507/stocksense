import React from 'react';

const FilterBar = () => {
  return (
    <div className="flex flex-wrap gap-3">
      <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors">
        <option value="">All Doc Types</option>
        <option value="receipt">Receipt</option>
        <option value="delivery">Delivery</option>
        <option value="transfer">Transfer</option>
      </select>
      <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors">
        <option value="">All Statuses</option>
        <option value="Draft">Draft</option>
        <option value="Waiting">Waiting</option>
        <option value="Ready">Ready</option>
        <option value="Done">Done</option>
        <option value="Canceled">Canceled</option>
      </select>
      <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors">
        <option value="">All Warehouses</option>
        <option value="main">Main WH</option>
        <option value="secondary">Secondary WH</option>
      </select>
      <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-colors">
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
    </div>
  );
};

export default FilterBar;
