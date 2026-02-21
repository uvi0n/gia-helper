import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { chatWithAI } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  images?: string[];
}

interface Props {
  onBack: () => void;
}

const AIAssistant: React.FC<Props> = ({ onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Привет! Я твой ИИ-ассистент. Чем могу помочь сегодня? Ты можешь задать вопрос текстом или прислать фото задания.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!input.trim() && selectedImages.length === 0) return;
    if (isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      images: selectedImages.length > 0 ? [...selectedImages] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImages([]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = await chatWithAI(userMessage.text, history, userMessage.images);
      
      let assistantText = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        assistantText += chunk.text || '';
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = assistantText;
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Извини, произошла ошибка при обработке запроса.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-white dark:bg-[#0F172A] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white dark:bg-[#1E293B]/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-lg">ИИ Ассистент</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Онлайн</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-8 custom-scrollbar bg-slate-50/30 dark:bg-transparent">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              {msg.images && msg.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 justify-end">
                  {msg.images.map((img, i) => (
                    <img key={i} src={img} className="w-48 h-48 object-cover rounded-3xl border-4 border-white dark:border-slate-800 shadow-xl" alt="User upload" />
                  ))}
                </div>
              )}
              <div className={`p-6 rounded-[2rem] text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-[#1E293B] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'
              }`}>
                <div className="markdown-body">
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-[#1E293B] p-5 rounded-[2rem] rounded-tl-none border border-slate-100 dark:border-slate-800 flex gap-1.5">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white dark:bg-[#0F172A] border-t border-slate-100 dark:border-slate-800/50">
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6 animate-in slide-in-from-bottom-2">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg group">
                <img src={img} className="w-full h-full object-cover" alt="Preview" />
                <button onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-5 bg-slate-100 dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 rounded-2xl hover:text-indigo-600 dark:hover:text-indigo-400 transition-all hover:scale-105 active:scale-95"
          >
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" multiple />
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <div className="flex-grow relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Задай вопрос..."
              className="w-full p-5 pr-16 rounded-[1.5rem] bg-slate-100 dark:bg-[#1E293B] border-2 border-transparent focus:border-indigo-500/50 outline-none resize-none max-h-32 text-slate-900 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || (!input.trim() && selectedImages.length === 0)}
              className="absolute right-3 bottom-3 p-3 bg-indigo-600 text-white rounded-xl disabled:opacity-30 disabled:grayscale hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-90"
            >
              <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
