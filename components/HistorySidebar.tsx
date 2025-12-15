import React from 'react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="lg:w-80 w-full shrink-0 space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Studies</h3>
            <button onClick={onClear} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear</button>
        </div>
        <div className="space-y-3">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600 group"
            >
              <div className="font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-primary transition-colors">
                {item.topic}
              </div>
              <div className="flex justify-between items-center mt-1">
                 <span className="text-xs text-gray-500 dark:text-gray-400 capitalize bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                    {item.type}
                 </span>
                 <span className="text-[10px] text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                 </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
