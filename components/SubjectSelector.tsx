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
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Твой умный помощник в учёбе</h2>
        <div className="flex justify-center pt-4">
          <div className="bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-800">
            <button onClick={() => onGradeChange('oge')} className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${gradeLevel === 'oge' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>ОГЭ</button>
            <button onClick={() => onGradeChange('ege')} className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${gradeLevel === 'ege' ? 'bg-white dark:bg-slate-800 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>ЕГЭ</button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {SPECIFIC_SUBJECTS.map((sub) => (
          <button key={sub.id} onClick={() => handleSelect(sub)} className="group flex flex-col items-center p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500 transition-all">
            <span className="text-4xl mb-3">{sub.icon}</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{sub.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelector;