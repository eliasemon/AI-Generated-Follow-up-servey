import React from 'react';
import { History } from 'lucide-react';

interface HistoryButtonProps {
  onClick: () => void;
}

export const HistoryButton: React.FC<HistoryButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed flex gap-2 bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      aria-label="View History"
    >
      <span>Show All Provided Answer</span> 
      <History className="w-6 h-6" />
    </button>
  );
}