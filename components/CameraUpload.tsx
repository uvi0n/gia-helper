import React, { useRef, useState, useCallback } from 'react';

interface Props {
  onImagesReady: (base64Array: string[]) => void;
  onBack: () => void;
  disabled?: boolean;
}

const CameraUpload: React.FC<Props> = ({ onImagesReady, onBack, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraMode, setIsCameraMode] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraMode(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Не удалось получить доступ к камере.");
    }
  };

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraMode(false);
  }, [stream]);

  const resizeImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
        } else {
          if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else { resolve(dataUrl); }
      };
      img.src = dataUrl;
    });
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const resized = await resizeImage(canvas.toDataURL('image/jpeg', 0.8));
        setSelectedImages(prev => [...prev, resized]);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      Array.from(fileList).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const resized = await resizeImage(reader.result as string);
          setSelectedImages(prev => [...prev, resized]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (isCameraMode) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-4 animate-in fade-in zoom-in-95">
        <div className="relative aspect-[3/4] bg-black rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
            <button onClick={stopCamera} className="w-12 h-12 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button onClick={capturePhoto} className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center shadow-lg active:scale-90 transition-all">
              <div className="w-16 h-16 bg-white border-2 border-slate-900 rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-500 font-black text-sm uppercase tracking-tight transition-colors group">
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Назад к режимам
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button 
            onClick={startCamera}
            disabled={disabled}
            className="group relative aspect-square sm:aspect-auto sm:h-64 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl hover:bg-indigo-700 transition-all flex flex-col items-center justify-center gap-6 overflow-hidden"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            </div>
            <span className="font-black text-2xl uppercase tracking-widest">Камера</span>
          </button>

          <button 
            onClick={() => !disabled && fileInputRef.current?.click()}
            disabled={disabled}
            className="group relative aspect-square sm:aspect-auto sm:h-64 bg-slate-100 dark:bg-[#1E293B]/50 border-2 border-transparent dark:border-slate-800 rounded-[2.5rem] text-slate-900 dark:text-white shadow-xl hover:border-indigo-500 transition-all flex flex-col items-center justify-center gap-6 overflow-hidden"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" multiple />
            <div className="w-20 h-20 bg-slate-200 dark:bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-10 h-10 text-slate-500 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <span className="font-black text-2xl uppercase tracking-widest">Файлы</span>
          </button>
        </div>

        <div className="lg:col-span-4">
          <div className="h-full bg-white dark:bg-[#1E293B]/30 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 p-8 shadow-sm">
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8">Мульти-загрузка</h4>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-bold">Вы можете добавить сразу несколько фотографий или страниц заданий.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-bold">ИИ проанализирует все снимки и выдаст общий список решений.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImages.length > 0 && (
        <div className="bg-white dark:bg-[#1E293B] rounded-[2.5rem] p-8 border-2 border-indigo-500/20 shadow-2xl space-y-6 animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest">Выбранные фото ({selectedImages.length})</h4>
            <button onClick={() => setSelectedImages([])} className="text-xs font-black text-red-500 hover:underline uppercase tracking-tighter">Очистить все</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {selectedImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800">
                <img src={img} className="w-full h-full object-cover" alt="Selected" />
              </div>
            ))}
          </div>
          <button onClick={() => onImagesReady(selectedImages)} className="w-full py-6 bg-emerald-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-emerald-700 active:scale-[0.98] transition-all uppercase tracking-widest">Начать разбор</button>
        </div>
      )}
    </div>
  );
};

export default CameraUpload;
