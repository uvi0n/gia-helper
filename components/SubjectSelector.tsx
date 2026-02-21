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
    <div className="w-full max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <a 
          href="https://t.me/sdamgia67" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition-all mb-2 group"
        >
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Следи за обновлениями в TG
        </a>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">Твой умный путь к <span className="text-indigo-600">успеху</span></h2>
        
        <div className="flex justify-center pt-4">
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] flex gap-1 border border-slate-200 dark:border-slate-800 shadow-inner">
            <button 
              onClick={() => onGradeChange('oge')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                gradeLevel === 'oge' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              9 класс (ОГЭ)
            </button>
            <button 
              onClick={() => onGradeChange('ege')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                gradeLevel === 'ege' 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-md' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              11 класс (ЕГЭ)
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => handleSelect(GLOBAL_SUBJECT)}
          className="group relative w-full p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-6 overflow-hidden"
        >
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
            {GLOBAL_SUBJECT.icon}
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black uppercase tracking-tight">Общий поиск</h3>
            <p className="text-indigo-100 text-xs font-bold opacity-80 uppercase tracking-widest">По всей базе знаний</p>
          </div>
          <div className="ml-auto bg-white/20 p-2 rounded-full group-hover:translate-x-1 transition-transform">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </div>
        </button>

        <button
          onClick={() => (window as any).onAISelect?.()}
          className="group relative w-full p-8 bg-emerald-600 rounded-[2.5rem] text-white shadow-2xl hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-6 overflow-hidden"
        >
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform shadow-inner">
            🤖
          </div>
          <div className="text-left">
            <h3 className="text-xl font-black uppercase tracking-tight">ИИ Ассистент</h3>
            <p className="text-emerald-100 text-xs font-bold opacity-80 uppercase tracking-widest">Чат и разбор фото</p>
          </div>
          <div className="absolute top-4 right-6 bg-white/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest backdrop-blur-sm">Beta</div>
        </button>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800"></div></div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">
          <span className="bg-slate-50 dark:bg-slate-950 px-6">Предметы</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {SPECIFIC_SUBJECTS.map((sub) => {
          const tasksCount = gradeLevel === 'ege' ? sub.maxTasksEge : sub.maxTasksOge;
          if (tasksCount === 0) return null;
          
          return (
            <button
              key={sub.id}
              onClick={() => handleSelect(sub)}
              className="group flex flex-col items-center p-6 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-[2rem] hover:border-indigo-500 hover:shadow-xl hover:scale-[1.03] active:scale-95 transition-all"
            >
              <span className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-sm">{sub.icon}</span>
              <span className="font-black text-slate-900 dark:text-white text-sm text-center uppercase tracking-tight leading-tight mb-2">{sub.name}</span>
              <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  {tasksCount} зад.
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectSelector;
