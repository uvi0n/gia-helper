import React from 'react';
import { AnalysisResults } from '../types';

const AnalysisResultView: React.FC<{ results: AnalysisResults, onReset: () => void }> = ({ results, onReset }) => {
  return (
    <div className="space-y-6">
      <button onClick={onReset} className="text-indigo-600 font-bold">Новый поиск</button>
      {results.tasks.map((t, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border">
          <h4 className="font-black text-indigo-600 mb-2">Задание {t.taskNumber}</h4>
          <p className="mb-4 text-sm">{t.taskText}</p>
          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl mb-4">
            <span className="font-black text-emerald-600 uppercase text-xs">Ответ:</span>
            <p className="text-xl font-bold">{t.answer}</p>
          </div>
          <p className="text-sm leading-relaxed">{t.explanation}</p>
        </div>
      ))}
    </div>
  );
};

export default AnalysisResultView;