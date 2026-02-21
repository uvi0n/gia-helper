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
    <div className="space-y-8">
      <button onClick={onReset} className="text-indigo-600 font-bold">← Назад</button>
      {isVariant && (
        <div className="bg-emerald-600 text-white p-6 rounded-3xl">
          <h2 className="text-2xl font-black">Вариант экзамена</h2>
          <div className="mt-4 space-y-4">
            {results.tasks.map((t, i) => (
              <div key={i} className="bg-white/10 p-4 rounded-xl text-sm">{t.taskText}</div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border p-6">
        <h3 className="font-bold mb-4">Ответы:</h3>
        {results.tasks.map((t, i) => (
          <div key={i} className="flex justify-between py-2 border-b last:border-0">
            <span className="font-bold">№{t.taskNumber || (i+1)}</span>
            <span className="text-emerald-600 font-black">{t.answer}</span>
          </div>
        ))}
      </div>
      {showSolutions && (
        <div className="space-y-4">
          {results.tasks.map((t, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border">
              <div className="font-bold mb-2">Разбор задания №{t.taskNumber || (i+1)}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">{t.explanation}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisResultView;
