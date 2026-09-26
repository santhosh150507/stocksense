import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, SlidersHorizontal } from 'lucide-react';



const getIcon = (type) => {
  switch (type) {
    case 'Receipt': return <ArrowDownToLine className="w-4 h-4 text-emerald-600" />;
    case 'Delivery': return <ArrowUpFromLine className="w-4 h-4 text-indigo-600" />;
    case 'Transfer': return <ArrowRightLeft className="w-4 h-4 text-blue-600" />;
    case 'Adjustment': return <SlidersHorizontal className="w-4 h-4 text-amber-600" />;
    default: return null;
  }
};

const ActivityFeed = ({ activities = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-semibold text-gray-900">Recent Operations</h2>
        <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors">View all</button>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
        {activities.length === 0 ? (
          <div className="text-sm text-gray-500 py-4 text-center">No recent activity.</div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 group cursor-pointer">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-indigo-50 transition-colors">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 flex flex-col border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-semibold text-gray-900 text-sm mr-2 group-hover:text-indigo-600 transition-colors">{activity.refId || 'N/A'}</span>
                    <span className="text-xs text-gray-500 font-medium hidden sm:inline">{activity.type}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {activity.createdAt ? new Date(activity.createdAt).toLocaleDateString() : activity.time}
                  </span>
                </div>
              <p className="text-sm text-gray-600 mb-2.5 leading-relaxed">{activity.description}</p>
              <div className="flex">
                <StatusBadge status={activity.status} />
              </div>
            </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
