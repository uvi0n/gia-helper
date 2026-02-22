import React from 'react';
import { AnalysisResults } from '../types';
import { motion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';

interface Props {
  results: AnalysisResults;
  onReset: () => void;
}

const AnalysisResultView: React.FC<Props> = ({ results, onReset }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-4xl mx-auto space-y-12 pb-20"
    >
      <button 
        onClick={onReset}
        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Новое сканирование
      </button>

      {/* Summary Answers Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-widest">
            Список ответов
          </h3>
          <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
            {results.tasks.length} {results.tasks.length === 1 ? 'задание' : results.tasks.length < 5 ? 'задания' : 'заданий'}
          </span>
        </div>
        
        <div className="divide-y divide-slate-50 dark:divide-slate-800">
          {results.tasks.map((task, idx) => (
            <div key={idx} className="flex items-center p-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="w-12 h-12 flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center font-black text-sm mr-6">
                {task.taskNumber || (idx + 1)}
              </div>
              <div className="flex-grow">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Ответ:</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                  {task.answer}
                </p>
              </div>
              <ChevronDown className="w-6 h-6 text-slate-200 dark:text-slate-700" />
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Breakdown Section */}
      <section className="space-y-8">
        <h3 className="font-black text-slate-900 dark:text-white text-xl flex items-center gap-3">
          <FileText className="w-6 h-6 text-indigo-500" />
          Подробный разбор
        </h3>

        {results.tasks.map((task, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-8 flex flex-col md:flex-row gap-8">
              <div className="flex-grow space-y-6">
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Задание {task.taskNumber || (idx + 1)}</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic text-lg">"{task.taskText}"</p>
                
                <div className="pt-4">
                  <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4">Объяснение</span>
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium whitespace-pre-line">
                    {task.explanation}
                  </div>
                </div>
              </div>

              <div className="md:w-48 shrink-0">
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 text-center">
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-2">Ответ</p>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 leading-none">{task.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Sources Section */}
      {results.sources.length > 0 && (
        <section className="p-8 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-6">
             <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">Использованные источники</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.sources.map((source, idx) => (
              <li key={idx}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-bold group transition-all hover:shadow-md"
                >
                  <svg className="w-5 h-5 flex-shrink-0 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="truncate">{source.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </motion.div>
  );
};

export default AnalysisResultView;
