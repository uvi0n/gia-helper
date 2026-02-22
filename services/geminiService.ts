import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResults, Subject, SearchMode } from "../types";

export const analyzeTask = async (
  subject: Subject, 
  input: { base64Images?: string[]; taskText?: string }, 
  mode: SearchMode,
  taskNumber?: number
): Promise<AnalysisResults> => {
  
  const apiKey = 'AIzaSyAwkiQGVvC4QIneN1OVaMcbgCDNjrZyswo'; 
  
  if (!apiKey || apiKey === 'ТВОЙ_КЛЮЧ_ЗДЕСЬ') {
    throw new Error("API_KEY не установлен. Вставьте ваш ключ в services/geminiService.ts");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelName = 'gemini-3-flash-preview';
  const siteUrl = `${subject.subdomain}.sdamgia.ru`;
  
  // Улучшенная инструкция для ИИ
  const systemInstruction = `Ты — ведущий эксперт по подготовке к экзаменам (ЕГЭ/ОГЭ). 
Твоя задача: найти решение задания на сайте ${siteUrl}.

КРИТИЧЕСКИ ВАЖНО ДЛЯ ТОЧНОСТИ:
1. Сначала полностью реши задание сам или найди официальный разбор.
2. Сверь полученный ответ с ходом решения. Если они расходятся — перепроверь решение.
3. В поле "answer" пиши ТОЛЬКО краткий финальный ответ (число, слово или последовательность цифр).
4. В поле "explanation" распиши логику решения максимально подробно.
5. Если в ответе должна быть последовательность цифр (например, 134), убедись, что они указаны верно и без лишних знаков.`;

  const prompt = `Предмет: ${subject.name}. 
${input.taskText ? `Текст задания: ${input.taskText}` : 'Задание на прикрепленных фото.'}
Найди решение и ответ на ${siteUrl}.`;

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
        tools: [{ googleSearch: {} }], // Используем поиск для актуальных данных
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }, // Максимальная точность размышлений
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
    if (!text) throw new Error("ИИ не смог проанализировать задание.");
    
    const result = JSON.parse(text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Источник решения',
      uri: chunk.web?.uri || '',
    })).filter((s: any) => s.uri) || [];

    return { tasks: result.tasks || [], sources };
  } catch (error: any) {
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Ошибка при обращении к ИИ");
  }
};

export const chatWithAI = async (message: string, history: any[], images?: string[]) => {
  // МЕСТО ДЛЯ КЛЮЧА №2
  const apiKey = 'AIzaSyAwkiQGVvC4QIneN1OVaMcbgCDNjrZyswo';
  
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

