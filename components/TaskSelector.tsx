import React from 'react';
import { Subject } from '../types';

interface Props {
  subject: Subject;
  selectedId: number | null;
  onSelect: (id: number) => void;
  onBack: () => void;
}

const TaskSelector: React.FC<Props> = ({ subject, selectedId, onSelect, onBack }) => {
  const tasks = Array.from({ length: subject.maxTasks }, (_, i) => i + 1);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-2 transition-colors group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Назад к режимам
      </button>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Номер задания ({subject.name})
        </h3>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          1 - {subject.maxTasks}
        </span>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {tasks.map((id) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`flex items-center justify-center aspect-square rounded-2xl border-2 font-black transition-all
              ${selectedId === id 
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 hover:border-indigo-300 dark:hover:border-indigo-500'}`}
          >
            {id}
          </button>
        ))}
      </div>
      
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
        <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
          <b>Важно:</b> Выбор конкретного номера помогает ИИ точнее искать ответ в базе sdamgia.ru.
        </p>
      </div>
    </div>
  );
};

export default TaskSelector;
