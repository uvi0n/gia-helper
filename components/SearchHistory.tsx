import React from 'react';
import { HistoryItem } from '../types';

interface Props {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onClear: () => void;
  onBack: () => void;
}

const SearchHistory: React.FC<Props> = ({ history, onSelectItem, onClear, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-bold text-slate-500">← Назад</button>
        <button onClick={onClear} className="text-xs font-bold text-red-500 uppercase">Очистить историю</button>
      </div>
      <div className="space-y-4">
        {history.map((item) => (
          <button key={item.id} onClick={() => onSelectItem(item)} className="w-full text-left bg-white dark:bg-slate-900 border rounded-3xl p-5 flex items-center gap-4">
            <div className="text-2xl">{item.subject.icon}</div>
            <div>
              <div className="font-black text-slate-900 dark:text-white">{item.subject.name}</div>
              <div className="text-xs text-slate-400">{item.queryPreview}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
