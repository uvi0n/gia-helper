import React from 'react';
import { HistoryItem } from '../types';

const SearchHistory: React.FC<{ history: HistoryItem[], onSelectItem: (i: HistoryItem) => void, onBack: () => void }> = ({ history, onSelectItem, onBack }) => {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="text-slate-500 font-bold">Назад</button>
      <h2 className="text-2xl font-black">История</h2>
      {history.map(item => (
        <button key={item.id} onClick={() => onSelectItem(item)} className="w-full text-left p-4 bg-white dark:bg-slate-900 rounded-2xl border flex items-center gap-4">
          <span className="text-2xl">{item.subject.icon}</span>
          <div>
            <p className="font-bold">{item.subject.name}</p>
            <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default SearchHistory;