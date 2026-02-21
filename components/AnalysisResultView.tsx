import React, { useState } from 'react';
import { AnalysisResults } from '../types';

interface Props {
  results: AnalysisResults;
  onReset: () => void;
  isVariant?: boolean;
}

const AnalysisResultView: React.FC<Props> = ({ results, onReset, isVariant }) => {
  const [showSolutions, setShowSolutions] = useState(!isVariant);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={onReset}
        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {isVariant ? 'К выбору предметов' : 'Новое сканирование'}
      </button>

      {isVariant && (
        <section className="space-y-6">
          <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-black uppercase tracking-tight">Экзаменационный вариант</h2>
            <p className="opacity-90 text-sm font-medium">Все задания от 1 до {results.tasks.length}.</p>
          </div>

          <div className="space-y-4">
            {results.tasks.map((task, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold uppercase">Задание {task.taskNumber || (idx + 1)}</span>
                </div>
                <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
                  {task.taskText}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wider">
            {isVariant ? 'Таблица ответов' : 'Список ответов'}
          </h3>
        </div>
        
        <div className="p-4">
          {results.tasks.map((task, idx) => (
            <div key={idx} className="flex items-center p-4 border-b last:border-0 border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full flex items-center justify-center font-bold text-xs mr-4">
                {task.taskNumber || (idx + 1)}
              </div>
              <div className="flex-grow">
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{task.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showSolutions && (
        <section className="space-y-6">
          {results.tasks.map((task, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
              <h4 className="font-bold mb-2">Объяснение задания {task.taskNumber || (idx + 1)}</h4>
              <div className="text-sm text-slate-700 dark:text-slate-300">{task.explanation}</div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default AnalysisResultView;
