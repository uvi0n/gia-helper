export const exportProjectCode = async () => {
  try {
    const response = await fetch('/package-lock.json');
    if (!response.ok) throw new Error('Failed to fetch package-lock.json');
    const content = await response.text();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'package-lock.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting package-lock.json:', error);
    alert('Не удалось скачать package-lock.json. Возможно, файл не доступен через веб-сервер.');
  }
};
