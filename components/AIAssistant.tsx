import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { chatWithAI } from '../services/geminiService';

const AIAssistant: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState([{ role: 'model', text: 'Привет! Чем могу помочь?' }]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    const stream = await chatWithAI(input, []);
    let fullText = '';
    setMessages(prev => [...prev, { role: 'model', text: '' }]);
    
    for await (const chunk of stream) {
      fullText += chunk.text || '';
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1].text = fullText;
        return next;
      });
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden">
      <div className="p-4 border-b flex items-center gap-4">
        <button onClick={onBack}>Назад</button>
        <h3 className="font-black uppercase">ИИ Ассистент</h3>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white ml-auto' : 'bg-slate-100 dark:bg-slate-800'}`}>
            <Markdown>{m.text}</Markdown>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-grow p-2 border rounded-xl" />
        <button onClick={handleSend} className="bg-indigo-600 text-white px-4 rounded-xl">Отправить</button>
      </div>
    </div>
  );
};

export default AIAssistant;