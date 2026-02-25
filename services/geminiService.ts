import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResults, Subject, SearchMode } from "../types";

// Удален кэш для обеспечения свежих результатов при каждом поиске
export const analyzeTask = async (
  subject: Subject, 
  input: { base64Images?: string[]; taskText?: string }, 
  mode: SearchMode,
  taskNumber?: number
): Promise<AnalysisResults> => {
  // ВСТАВЬТЕ ВАШ КЛЮЧ ЗДЕСЬ (вместо process.env.API_KEY если хотите хардкод)
  const apiKey = process.env.API_KEY; 
  if (!apiKey) throw new Error("API_KEY не установлен.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  // Переключаемся на стабильную модель gemini-flash-latest (1.5 Flash), 
  // так как 3.0 Flash Preview часто выдает ошибку 503 при высокой нагрузке.
  const modelName = 'gemini-flash-latest';
  const siteUrl = `${subject.subdomain}.sdamgia.ru`;
  
  const systemInstruction = `Ты — эксперт по подготовке к экзаменам (ЕГЭ/ОГЭ). 
Твоя задача: проанализировать материалы и найти точные решения на сайте ${siteUrl}.

КРИТИЧЕСКИ ВАЖНО:
1. Сначала напиши подробное пошаговое ОБЪЯСНЕНИЕ (explanation).
2. На основе своего объяснения выведи финальный ОТВЕТ (answer).
3. ПЕРЕПРОВЕРЬ ответ: он должен строго соответствовать логике объяснения.
4. Ответ должен быть кратким (число, слово или последовательность цифр), как того требует формат экзамена.`;

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
        // Убрали googleSearch и thinkingConfig для стабильности на бесплатном API
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
    
    return { tasks: result.tasks || [], sources: [] };
  } catch (error: any) {
    // Обработка ошибок квоты и перегрузки
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error("Превышен лимит запросов (ошибка 429). Попробуйте подождать 1-2 минуты.");
    }
    if (error.message?.includes('503')) {
      throw new Error("Сервер Google временно перегружен (ошибка 503). Попробуйте еще раз через несколько секунд.");
    }
    throw new Error(error.message || "Ошибка API");
  }
};

export const chatWithAI = async (message: string, history: any[], images?: string[]) => {
  const apiKey = process.env.API_KEY; 
  if (!apiKey) throw new Error("API_KEY не установлен.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const chat = ai.chats.create({ 
    model: 'gemini-flash-latest', 
    history: history.length > 0 ? history : undefined,
    config: { systemInstruction: "Ты — помощник." } 
  });
  const parts: any[] = [{ text: message }];
  if (images) {
    images.forEach(img => parts.push({ inlineData: { mimeType: 'image/jpeg', data: img.split(',')[1] || img } }));
  }
  return await chat.sendMessageStream({ message: parts });
};
