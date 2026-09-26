import React from 'react';
import StatusBadge from '../common/StatusBadge';

const activities = [
  { id: 1, type: 'Receipt', description: 'Received 50 units of SKU-1001', time: '2 hours ago', status: 'Done' },
  { id: 2, type: 'Delivery', description: 'Packed Order #4920 for shipping', time: '4 hours ago', status: 'Ready' },
  { id: 3, type: 'Transfer', description: 'Moved 20 units to WH-South', time: '1 day ago', status: 'Done' },
  { id: 4, type: 'Adjustment', description: 'Inventory count updated for SKU-2005', time: '2 days ago', status: 'Draft' },
];

const ActivityFeed = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-lg font-semibold mb-5 text-gray-800">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex flex-col border-b border-gray-100 pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <span className="font-semibold text-gray-800 text-sm">{activity.type}</span>
              <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
            <div className="flex">
              <StatusBadge status={activity.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
