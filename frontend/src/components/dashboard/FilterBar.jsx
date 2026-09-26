import React from 'react';
import { Filter, Search } from 'lucide-react';

const FilterBar = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <div className="relative flex-1 sm:w-64">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          placeholder="Filter records..."
        />
      </div>
      <div className="flex gap-2">
        <select className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-white">
          <option>All Statuses</option>
          <option>Draft</option>
          <option>Waiting</option>
          <option>Ready</option>
          <option>Done</option>
          <option>Cancelled</option>
        </select>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <Filter className="w-4 h-4 mr-2 text-gray-500" />
          More
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
