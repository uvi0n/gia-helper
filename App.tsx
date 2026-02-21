import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CameraUpload from './components/CameraUpload';
import AnalysisResultView from './components/AnalysisResultView';
import TaskSelector from './components/TaskSelector';
import SubjectSelector from './components/SubjectSelector';
import SearchHistory from './components/SearchHistory';
import AIAssistant from './components/AIAssistant';
import { ProcessingState, AnalysisResults, SearchMode, Subject, HistoryItem, GradeLevel } from './types';
import { analyzeTask } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ProcessingState>({ status: 'selecting_subject' });
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [result, setResult] = useState<AnalysisResults | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('all');
  const [taskTextInput, setTaskTextInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('ege');

  useEffect(() => {
    (window as any).onAISelect = () => {
      setState({ status: 'ai_assistant' });
    };
    return () => { delete (window as any).onAISelect; };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ege_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ege_history', JSON.stringify(history));
  }, [history]);

  const startAnalysis = async (input: { base64Images?: string[]; taskText?: string }) => {
    if (!selectedSubject) return;
    const isVariant = searchMode === 'variant';
    setState({ 
      status: 'loading', 
      message: isVariant ? `Генерируем полный вариант...` : `Ищем решения...` 
    });
    
    try {
      const data = await analyzeTask(
        selectedSubject, 
        input,
        searchMode,
        searchMode === 'specific' ? (selectedTaskId || undefined) : undefined
      );
      
      setResult(data);
      setState({ status: 'success' });

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        subject: selectedSubject,
        timestamp: Date.now(),
        queryType: searchMode,
        queryPreview: isVariant 
          ? `Вариант (${data.tasks.length} зад.)` 
          : (input.taskText || "Поиск по фото"),
        results: data
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (error: any) {
      setState({ status: 'error', message: error.message || "Ошибка запроса." });
    }
  };

  const handleImagesReady = (images: string[]) => startAnalysis({ base64Images: images });

  const resetToMode = () => {
    setState({ status: 'idle' });
    setResult(null);
    setTaskTextInput('');
  };

  const resetToSubject = () => {
    setState({ status: 'selecting_subject' });
    setSelectedSubject(null);
    setResult(null);
    setTaskTextInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8">
        {state.status === 'selecting_subject' && (
          <SubjectSelector 
            gradeLevel={gradeLevel} 
            onGradeChange={setGradeLevel} 
            onSelect={(s) => { setSelectedSubject(s); setState({ status: 'idle' }); }} 
          />
        )}

        {state.status === 'idle' && selectedSubject && (
          <div className="space-y-8 py-10">
            <div className="flex items-center justify-between">
              <button onClick={resetToSubject} className="text-slate-500 font-bold text-sm">← Назад</button>
              {history.length > 0 && (
                <button onClick={() => setState({ status: 'viewing_history' })} className="text-indigo-600 font-bold text-sm">История ({history.length})</button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => { setSearchMode('all'); setState({ status: 'ready_to_upload' }); }} className="p-8 bg-indigo-600 text-white rounded-[2.5rem]">ФОТО</button>
              <button onClick={() => { setSearchMode('text'); setState({ status: 'text_input' }); }} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border">ТЕКСТ</button>
              <button onClick={() => { setSearchMode('specific'); setState({ status: 'selecting_task' }); }} className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border">НОМЕР</button>
            </div>
            <button onClick={() => { setSearchMode('variant'); startAnalysis({}); }} className="w-full p-6 bg-emerald-600 text-white rounded-[2.5rem]">Сгенерировать вариант</button>
          </div>
        )}

        {state.status === 'viewing_history' && (
          <SearchHistory 
            history={history} 
            onSelectItem={(item) => { setSelectedSubject(item.subject); setResult(item.results); setState({ status: 'success' }); }} 
            onClear={() => { setHistory([]); localStorage.removeItem('ege_history'); }} 
            onBack={() => setState({ status: 'idle' })} 
          />
        )}

        {state.status === 'text_input' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border">
            <textarea value={taskTextInput} onChange={(e) => setTaskTextInput(e.target.value)} className="w-full h-40 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-4" placeholder="Введите текст..." />
            <button onClick={() => startAnalysis({ taskText: taskTextInput })} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold">НАЙТИ</button>
            <button onClick={resetToMode} className="w-full mt-2 text-slate-400">Отмена</button>
          </div>
        )}

        {state.status === 'ready_to_upload' && <CameraUpload onImagesReady={handleImagesReady} onBack={resetToMode} />}
        {state.status === 'selecting_task' && <TaskSelector subject={selectedSubject!} selectedId={selectedTaskId} onSelect={(id) => { setSelectedTaskId(id); setState({ status: 'ready_to_upload' }); }} onBack={resetToMode} />}
        {state.status === 'loading' && <div className="text-center py-20 font-bold text-indigo-600">{state.message}</div>}
        {state.status === 'error' && <div className="text-center p-10 bg-red-50 rounded-3xl text-red-600">{state.message}<br/><button onClick={resetToMode} className="mt-4 font-bold underline">Назад</button></div>}
        {state.status === 'ai_assistant' && <AIAssistant onBack={() => setState({ status: 'selecting_subject' })} />}
        {state.status === 'success' && result && <AnalysisResultView results={result} onReset={resetToMode} isVariant={searchMode === 'variant'} />}
      </main>
    </div>
  );
};

export default App;
