import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResults, Subject, SearchMode } from "../types";

export const analyzeTask = async (
  subject: Subject, 
  input: { base64Images?: string[]; taskText?: string }, 
  mode: SearchMode,
  taskNumber?: number
): Promise<AnalysisResults> => {
  // Используем ключ из окружения
  const apiKey = 'AIzaSyAb5NZF4eQbX_EBDZGrWNkzzpNEZFFb3AE'; 
  if (!apiKey) throw new Error("API_KEY не установлен.");
  
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelName = 'gemini-3-flash-preview';
  const siteUrl = `${subject.subdomain}.sdamgia.ru`;
  
  const systemInstruction = `Ты — эксперт по подготовке к экзаменам (ЕГЭ/ОГЭ). 
Твоя задача: проанализировать задание и найти правильное решение.
Ориентируйся на логику и базу знаний сайта ${siteUrl}.

КРИТИЧЕСКИ ВАЖНО:
1. Сначала напиши подробное пошаговое ОБЪЯСНЕНИЕ (explanation).
2. На основе объяснения выведи финальный ОТВЕТ (answer).
3. Ответ должен быть кратким (число, слово или последовательность цифр).`;

  const prompt = `Предмет: ${subject.name}. ${taskNumber ? `ЗАДАНИЕ №${taskNumber}. ` : ''}${input.taskText ? `Текст: ${input.taskText}` : 'Задания на фото.'}`;

  const parts: any[] = [{ text: prompt }];
  if (input.base64Images) {
    input.base64Images.forEach(base64 => {
      parts.push({ inlineData: { mimeType: 'image/jpeg', data: base64.split(',')[1] || base64 } });
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: 'user', parts }],
      config: {
        systemInstruction,
        // УБРАЛИ googleSearch для обхода ошибки 429
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  taskNumber: { type: Type.STRING },
                  taskText: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["taskText", "answer", "explanation"],
              }
            }
          },
          required: ["tasks"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Ошибка анализа.");
    const result = JSON.parse(text);
    
    // Источники теперь будут пустыми, так как поиск отключен
    return { tasks: result.tasks || [], sources: [] };
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error("Лимит запросов исчерпан. Подождите 1-2 минуты. Если ошибка повторяется — проверьте баланс API ключа.");
    }
    throw new Error(error.message || "Ошибка API");
  }
};

export const chatWithAI = async (message: string, history: any[], images?: string[]) => {
  // МЕСТО ДЛЯ КЛЮЧА №2
  const apiKey = 'AIzaSyBFYXh8p88ETHZaWFuh5jzKtHEcxeGRtMg';
  
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const chat = ai.chats.create({ 
    model: 'gemini-3-flash-preview', 
    history: history.length > 0 ? history : undefined,
    config: { systemInstruction: "Ты — умный помощник по учебе. Отвечай кратко и по делу." } 
  });
  
  const parts: any[] = [{ text: message }];
  if (images) {
    images.forEach(img => parts.push({ inlineData: { mimeType: 'image/jpeg', data: img.split(',')[1] || img } }));
  }
  return await chat.sendMessageStream({ message: parts });
};









