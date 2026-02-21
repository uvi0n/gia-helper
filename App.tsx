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
    setState({ 
      status: 'loading', 
      message: `Ищем решения в базе знаний...` 
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
        queryPreview: (input.taskText || (input.base64Images && input.base64Images.length > 0 ? `Поиск по фото (${input.base64Images.length})` : "Запрос")),
        results: data
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (error: any) {
      setState({ status: 'error', message: error.message || "Ошибка при выполнении запроса." });
    }
  };

  const handleImagesReady = (images: string[]) => startAnalysis({ base64Images: images });

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskTextInput.trim()) startAnalysis({ taskText: taskTextInput });
  };

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
          <div className="space-y-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <button onClick={resetToSubject} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors group">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Назад к предметам
              </button>
              {history.length > 0 && (
                <button onClick={() => setState({ status: 'viewing_history' })} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:underline">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  История ({history.length})
                </button>
              )}
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-6 py-2 rounded-full border border-indigo-100 dark:border-indigo-800">
                <span className="text-2xl">{selectedSubject.icon}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-tight">{selectedSubject.name}</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white">Как будем искать?</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button onClick={() => { setSearchMode('all'); setState({ status: 'ready_to_upload' }); }} className="group p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl hover:bg-indigo-700 transition-all flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">📸</div>
                <span className="font-black text-lg tracking-tight uppercase text-center">ФОТО<br/><span className="text-[10px] opacity-80 font-bold">(поиск по всем заданиям)</span></span>
              </button>
              <button onClick={() => { setSearchMode('text'); setState({ status: 'text_input' }); }} className="group p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">⌨️</div>
                <span className="font-black text-lg tracking-tight uppercase text-slate-900 dark:text-white text-center">ТЕКСТ<br/><span className="text-[10px] text-slate-400 font-bold">(поиск по всем заданиям)</span></span>
              </button>
              <button onClick={() => { setSearchMode('specific'); setState({ status: 'selecting_task' }); }} className="group p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🔢</div>
                <span className="font-black text-lg tracking-tight uppercase text-slate-900 dark:text-white text-center">ВЫБРАТЬ НОМЕР ЗАДАНИЯ</span>
              </button>
            </div>
          </div>
        )}

        {state.status === 'viewing_history' && (
          <SearchHistory history={history} onSelectItem={(item) => { setSelectedSubject(item.subject); setResult(item.results); setState({ status: 'success' }); }} onClear={() => { setHistory([]); localStorage.removeItem('ege_history'); }} onBack={() => setState({ status: 'idle' })} />
        )}

        {state.status === 'text_input' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <button onClick={resetToMode} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold text-sm mb-6 transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Назад
            </button>
            <h3 className="text-2xl font-black mb-6 text-slate-900 dark:text-white">Введите текст задания</h3>
            <textarea value={taskTextInput} onChange={(e) => setTaskTextInput(e.target.value)} placeholder="Напишите первые слова задания..." className="w-full h-40 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 mb-6 transition-all outline-none resize-none dark:text-white" />
            <button onClick={handleTextSubmit} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all uppercase">НАЙТИ РЕШЕНИЕ</button>
          </div>
        )}

        {state.status === 'ready_to_upload' && <CameraUpload onImagesReady={handleImagesReady} onBack={resetToMode} />}
        {state.status === 'selecting_task' && <TaskSelector subject={selectedSubject!} selectedId={selectedTaskId} onSelect={(id) => { setSelectedTaskId(id); setState({ status: 'ready_to_upload' }); }} onBack={resetToMode} />}

        {state.status === 'loading' && (
          <div className="text-center py-20 space-y-6 animate-pulse">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🔍</div>
            </div>
            <p className="font-black text-2xl tracking-tight uppercase text-indigo-600 dark:text-indigo-400">{state.message}</p>
          </div>
        )}

        {state.status === 'error' && (
          <div className="text-center bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] border-2 border-red-50 dark:border-red-900/20 shadow-xl max-w-lg mx-auto animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">⚠️</div>
            <h3 className="text-2xl font-black mb-2 text-slate-900 dark:text-white">Ошибка</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">{state.message}</p>
            <button onClick={resetToMode} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all">ПОПРОБОВАТЬ СНОВА</button>
          </div>
        )}

        {state.status === 'ai_assistant' && (
          <AIAssistant onBack={() => setState({ status: 'selecting_subject' })} />
        )}

        {state.status === 'success' && result && (
          <AnalysisResultView 
            results={result} 
            onReset={resetToMode} 
          />
        )}
      </main>
      <footer className="py-8 text-center border-t border-slate-200 dark:border-slate-900">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          © 2026 GIA HELPER • Твой путь к 100 баллам
        </p>
      </footer>
    </div>
  );
};

export default App;
