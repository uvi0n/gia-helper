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
    <div className="space-y-6">
      <button onClick={onBack} className="text-slate-500 font-bold text-sm">← Назад</button>
      <h3 className="text-xl font-black">Выберите номер задания ({subject.name})</h3>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {tasks.map((id) => (
          <button key={id} onClick={() => onSelect(id)} className={`aspect-square rounded-2xl border-2 font-black ${selectedId === id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900'}`}>
            {id}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskSelector;
