import React from 'react';
import { Subject, GradeLevel } from '../types';

export const GLOBAL_SUBJECT: Subject = { 
  id: 'global', 
  name: 'Все предметы', 
  subdomain: 'sdamgia', 
  icon: '🌐', 
  maxTasks: 0 
};

export const SPECIFIC_SUBJECTS: (Omit<Subject, 'maxTasks'> & { maxTasksEge: number; maxTasksOge: number })[] = [
  { id: 'rus', name: 'Русский язык', subdomain: 'rus', icon: '📝', maxTasksEge: 27, maxTasksOge: 13 },
  { id: 'math', name: 'Математика (П)', subdomain: 'math', icon: '📐', maxTasksEge: 19, maxTasksOge: 25 },
  { id: 'math-b', name: 'Математика (Б)', subdomain: 'mathb', icon: '🔢', maxTasksEge: 21, maxTasksOge: 0 },
  { id: 'soc', name: 'Обществознание', subdomain: 'soc', icon: '⚖️', maxTasksEge: 25, maxTasksOge: 24 },
  { id: 'hist', name: 'История', subdomain: 'hist', icon: '📜', maxTasksEge: 21, maxTasksOge: 24 },
  { id: 'phys', name: 'Физика', subdomain: 'phys', icon: '⚛️', maxTasksEge: 26, maxTasksOge: 22 },
  { id: 'bio', name: 'Биология', subdomain: 'bio', icon: '🧬', maxTasksEge: 28, maxTasksOge: 26 },
  { id: 'chem', name: 'Химия', subdomain: 'chem', icon: '🧪', maxTasksEge: 34, maxTasksOge: 23 },
  { id: 'inf', name: 'Информатика', subdomain: 'inf', icon: '💻', maxTasksEge: 27, maxTasksOge: 16 },
  { id: 'lit', name: 'Литература', subdomain: 'lit', icon: '📚', maxTasksEge: 11, maxTasksOge: 5 },
  { id: 'geo', name: 'География', subdomain: 'geo', icon: '🌍', maxTasksEge: 29, maxTasksOge: 30 },
  { id: 'en', name: 'Английский яз.', subdomain: 'en', icon: '🇬🇧', maxTasksEge: 42, maxTasksOge: 38 },
];

interface Props {
  gradeLevel: GradeLevel;
  onGradeChange: (grade: GradeLevel) => void;
  onSelect: (subject: Subject) => void;
}

const SubjectSelector: React.FC<Props> = ({ gradeLevel, onGradeChange, onSelect }) => {
  const getSubdomain = (sub: string) => {
    if (sub === 'sdamgia') return gradeLevel === 'ege' ? 'ege' : 'oge';
    return `${sub}-${gradeLevel}`;
  };

  const handleSelect = (subData: typeof SPECIFIC_SUBJECTS[0] | Subject) => {
    const maxTasks = 'maxTasks' in subData 
      ? subData.maxTasks 
      : (gradeLevel === 'ege' ? subData.maxTasksEge : subData.maxTasksOge);

    onSelect({
      id: subData.id,
      name: subData.name,
      subdomain: getSubdomain(subData.subdomain),
      icon: subData.icon,
      maxTasks
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <a 
          href="https://t.me/sdamgia67" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 dark:hover:bg-indigo-400/20 transition-all mb-4 group"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Наш Telegram канал
        </a>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Умный помощник по учёбе</h2>
        
        <div className="flex justify-center pt-4">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => onGradeChange('oge')}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                gradeLevel === 'oge' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              1-9 класс (ОГЭ)
            </button>
            <button 
              onClick={() => onGradeChange('ege')}
              className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                gradeLevel === 'ege' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              10-11 класс (ЕГЭ)
            </button>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 font-medium">Выберите предмет для поиска ответов</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => handleSelect(GLOBAL_SUBJECT)}
          className="group relative w-full p-6 bg-indigo-600 rounded-3xl text-white shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-4 overflow-hidden"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            {GLOBAL_SUBJECT.icon}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold leading-tight">Общий поиск</h3>
            <p className="text-indigo-100 text-xs opacity-80">По всей базе</p>
          </div>
          <svg className="w-5 h-5 ml-auto group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>

        <button
          onClick={() => (window as any).onAISelect?.()}
          className="group relative w-full p-6 bg-emerald-600 rounded-3xl text-white shadow-xl hover:bg-emerald-700 transition-all flex items-center gap-4 overflow-hidden"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
            🤖
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold leading-tight">ИИ Ассистент</h3>
            <p className="text-emerald-100 text-xs opacity-80">Чат и анализ фото</p>
          </div>
          <div className="ml-auto bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">Beta</div>
        </button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
          <span className="bg-slate-50 dark:bg-slate-950 px-4">Предметы</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {SPECIFIC_SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleSelect(sub)}
            className="group flex flex-col items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all aspect-[1.4/1]"
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{sub.icon}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm text-center">{sub.name}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase mt-2">
              {gradeLevel === 'ege' ? sub.maxTasksEge : sub.maxTasksOge} заданий
            </span>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Работает только с VРN
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;

