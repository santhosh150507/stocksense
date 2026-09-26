import React from 'react';
import { STATUS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  let bgColor = 'bg-gray-100 text-gray-800';
  
  switch (status) {
    case STATUS.DRAFT:
      bgColor = 'bg-gray-100 text-gray-800 border-gray-200';
      break;
    case STATUS.WAITING:
      bgColor = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case STATUS.READY:
      bgColor = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
    case STATUS.DONE:
      bgColor = 'bg-green-100 text-green-800 border-green-200';
      break;
    case STATUS.CANCELED:
      bgColor = 'bg-red-100 text-red-800 border-red-200';
      break;
    default:
      break;
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${bgColor}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
