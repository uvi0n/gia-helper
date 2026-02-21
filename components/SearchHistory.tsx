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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Назад
        </button>
        <button 
          onClick={onClear}
          className="text-xs font-bold text-red-500 hover:text-red-600 uppercase tracking-widest"
        >
          Очистить историю
        </button>
      </div>

      <div className="text-center space-y-2 mb-8">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white">История за сегодня</h2>
        <p className="text-slate-500 dark:text-slate-400">Ваши недавние поиски и решения</p>
      </div>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="font-bold text-slate-500">История пуста</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:border-indigo-500 hover:shadow-lg transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-2xl flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                {item.subject.icon}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-900 dark:text-white">{item.subject.name}</span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate font-medium italic">
                  {item.queryType === 'all' ? 'Поиск по фото' : item.queryType === 'specific' ? 'Поиск по номеру' : `Текст: ${item.queryPreview}`}
                </p>
              </div>
              <div className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHistory;
