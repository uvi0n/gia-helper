import React from 'react';
import { Subject, GradeLevel } from '../types';

export const GLOBAL_SUBJECT: Subject = { 
  id: 'global', 
  name: 'Общий поиск', 
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
    <div className="w-full max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center space-y-6">
        <a 
          href="https://t.me/sdamgia67" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all mb-2"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Следи за обновлениями в TG
        </a>
        <h2 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
          Твой умный путь к <span className="text-indigo-600 dark:text-indigo-500">успеху</span>
        </h2>
        
        <div className="flex justify-center pt-2">
          <div className="bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-3xl flex gap-1 border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <button 
              onClick={() => onGradeChange('oge')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                gradeLevel === 'oge' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              1-9 КЛАСС (ОГЭ)
            </button>
            <button 
              onClick={() => onGradeChange('ege')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                gradeLevel === 'ege' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-xl' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              10-11 КЛАСС (ЕГЭ)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => handleSelect(GLOBAL_SUBJECT)}
          className="group relative w-full p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl hover:bg-indigo-700 transition-all flex items-center gap-6 overflow-hidden"
        >
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
            {GLOBAL_SUBJECT.icon}
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">Общий поиск</h3>
            <p className="text-indigo-100 text-sm font-bold opacity-80 uppercase tracking-wide">По всей базе знаний</p>
          </div>
          <div className="ml-auto w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </button>

        <button
          onClick={() => (window as any).onAISelect?.()}
          className="group relative w-full p-8 bg-emerald-600 rounded-[2.5rem] text-white shadow-2xl hover:bg-emerald-700 transition-all flex items-center gap-6 overflow-hidden"
        >
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">
            🤖
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-black leading-tight uppercase tracking-tight">ИИ Ассистент</h3>
            <p className="text-emerald-100 text-sm font-bold opacity-80 uppercase tracking-wide">Чат и разбор фото</p>
          </div>
          <div className="absolute top-4 right-6 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Beta</div>
        </button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">
          <span className="bg-slate-50 dark:bg-slate-950 px-6">Предметы</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {SPECIFIC_SUBJECTS.map((sub) => (
          <button
            key={sub.id}
            onClick={() => handleSelect(sub)}
            className="group flex flex-col items-center p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-indigo-500 hover:shadow-2xl transition-all backdrop-blur-sm"
          >
            <span className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{sub.icon}</span>
            <span className="font-black text-slate-900 dark:text-white text-sm text-center uppercase tracking-tight mb-3">{sub.name}</span>
            <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              {gradeLevel === 'ege' ? sub.maxTasksEge : sub.maxTasksOge} зад.
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;

