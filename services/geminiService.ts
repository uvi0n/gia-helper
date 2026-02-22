import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResults, Subject, SearchMode } from "../types";

const cache = new Map<string, AnalysisResults>();

export const analyzeTask = async (
  subject: Subject, 
  input: { base64Images?: string[]; taskText?: string }, 
  mode: SearchMode,
  taskNumber?: number
): Promise<AnalysisResults> => {
  const cacheKey = JSON.stringify({
    subjectId: subject.id,
    taskText: input.taskText,
    taskNumber,
    mode,
    imagesCount: input.base64Images?.length || 0,
    imagesHash: input.base64Images?.map(img => img.substring(0, 100)).join('')
  });

  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const apiKey = 'AIzaSyAwkiQGVvC4QIneN1OVaMcbgCDNjrZyswo';
  if (!apiKey) throw new Error("API_KEY не установлен.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const modelName = 'gemini-3-flash-preview';
  const siteUrl = `${subject.subdomain}.sdamgia.ru`;
  
  const systemInstruction = `Ты — эксперт по образованию. Твоя задача: проанализировать предоставленные материалы и найти решения на сайте ${siteUrl}.`;

  const prompt = `Предмет: ${subject.name}. ${input.taskText ? `Текст: ${input.taskText}` : 'Задания на фото.'}`;

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
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
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
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Решение',
      uri: chunk.web?.uri || '',
    })).filter((s: any) => s.uri) || [];

    const finalResult = { tasks: result.tasks || [], sources };
    cache.set(cacheKey, finalResult);
    return finalResult;
  } catch (error: any) {
    throw new Error(error.message || "Ошибка API");
  }
};

export const chatWithAI = async (message: string, history: any[], images?: string[]) => {
  const apiKey = 'AIzaSyAwkiQGVvC4QIneN1OVaMcbgCDNjrZyswo';
  if (!apiKey) throw new Error("API_KEY не установлен.");
  const ai = new GoogleGenAI({ apiKey: apiKey });
  const chat = ai.chats.create({ 
    model: 'gemini-3-flash-preview', 
    history: history.length > 0 ? history : undefined,
    config: { systemInstruction: "Ты — помощник." } 
  });
  const parts: any[] = [{ text: message }];
  if (images) {
    images.forEach(img => parts.push({ inlineData: { mimeType: 'image/jpeg', data: img.split(',')[1] || img } }));
  }
  return await chat.sendMessageStream({ message: parts });
};

