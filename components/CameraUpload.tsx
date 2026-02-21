import React, { useRef, useState, useCallback } from 'react';

interface Props {
  onImagesReady: (base64Array: string[]) => void;
  onBack: () => void;
  disabled?: boolean;
}

const CameraUpload: React.FC<Props> = ({ onImagesReady, onBack, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList) {
      Array.from(fileList).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = () => {
    if (selectedImages.length > 0) onImagesReady(selectedImages);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <button onClick={onBack} className="text-slate-500 font-bold text-sm mb-2">Назад</button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => fileInputRef.current?.click()} className="p-10 bg-white dark:bg-slate-900 border-2 border-dashed rounded-3xl flex flex-col items-center gap-4">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept="image/*" />
          <span className="text-4xl">📁</span>
          <span className="font-black uppercase">Выбрать фото</span>
        </button>
      </div>
      {selectedImages.length > 0 && (
        <button onClick={handleSubmit} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black">НАЧАТЬ РАЗБОР</button>
      )}
    </div>
  );
};

export default CameraUpload;