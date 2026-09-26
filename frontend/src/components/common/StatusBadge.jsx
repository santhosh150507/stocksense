import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Waiting':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Ready':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Done':
      case 'Active':
      case 'In Stock':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
      case 'Out of Stock':
      case 'Inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Low Stock':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
