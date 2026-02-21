import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { AnalysisResults, Subject, SearchMode } from "../types";

// Простой кэш для предотвращения повторных запросов
const cache = new Map<string, AnalysisResults>();

export const analyzeTask = async (
  subject: Subject, 
  input: { base64Images?: string[]; taskText?: string }, 
  mode: SearchMode,
  taskNumber?: number
): Promise<AnalysisResults> => {
  // Создаем ключ для кэша
  const cacheKey = JSON.stringify({
    subjectId: subject.id,
    taskText: input.taskText,
    taskNumber,
    mode,
    imagesCount: input.base64Images?.length || 0,
    // Для простоты берем первые 100 символов каждой картинки как часть ключа
    imagesHash: input.base64Images?.map(img => img.substring(0, 100)).join('')
  });

  if (cache.has(cacheKey)) {
    console.log("Using cached result for:", cacheKey);
    return cache.get(cacheKey)!;
  }

  const ai = new GoogleGenAI({ apiKey: "AIzaSyAwkiQGVvC4QIneN1OVaMcbgCDNjrZyswo"});
  
  // Переключаемся на Flash модель для экономии кредитов
  const modelName = 'gemini-3-flash-preview';
  
  const siteUrl = `${subject.subdomain}.sdamgia.ru`;
  
  const isVariant = mode === 'variant';
  
  const systemInstruction = isVariant 
    ? `Ты — эксперт по образованию. Твоя задача: сгенерировать ПОЛНЫЙ тренировочный вариант экзамена по предмету ${subject.name} (всего ${subject.maxTasks} заданий).
    
    ИНСТРУКЦИИ:
    1. Используй Google Search, чтобы найти актуальные задания на сайте ${siteUrl}.
    2. Сформируй полноценный вариант, включающий задания всех типов, которые встречаются в экзамене.
    3. Для КАЖДОГО задания укажи правильный ответ и подробное объяснение.
    4. Верни строго JSON объект с массивом "tasks".
    5. Поле "taskNumber" должно соответствовать порядковому номеру задания в экзамене (от 1 до ${subject.maxTasks}).
    6. В поле "taskText" пиши ТОЛЬКО текст вопроса без номера задания.`
    : `Ты — эксперт по образованию и подготовке к экзаменам. 
Твоя задача: проанализировать предоставленные материалы (одно или несколько изображений/текст) и найти решения для ВСЕХ заданий, которые ты обнаружишь.

КРИТИЧЕСКИ ВАЖНО:
1. Если предоставлены изображения — выполни полный OCR-разбор всех снимков, найдя ВСЕ текстовые блоки заданий.
2. Для КАЖДОГО найденного задания используй Google Search, чтобы найти официальное решение и ответ на сайте ${siteUrl}.
3. Тщательно сверяй поле "answer" с "explanation". Ответ должен быть ПОЛНЫМ и ТОЧНЫМ. Если в задании несколько верных цифр (например, 234), в поле "answer" должны быть указаны ВСЕ эти цифры без пропусков.
4. Если задание содержит несколько подпунктов, разбей их на отдельные объекты в итоговом массиве.
5. Верни строго JSON объект с массивом "tasks".
6. Для каждого задания укажи: 
   - taskNumber: номер задания с листа или порядковый номер.
   - taskText: полный текст вопроса.
   - answer: краткий правильный ответ (максимально точно).
   - explanation: максимально подробный разбор решения с правилами.`;

  const prompt = isVariant
    ? `Сгенерируй полный вариант экзамена по предмету ${subject.name} на основе базы заданий ${siteUrl}. В варианте должно быть ровно ${subject.maxTasks} заданий.`
    : `Предмет: ${subject.name}. 
${taskNumber ? `Пользователь указал, что ищет задание №${taskNumber}, но если на материалах есть и другие задачи, разбери их все.` : 'Разбери все задания, которые видишь на предоставленных материалах.'}
${input.taskText ? `Текст для анализа: "${input.taskText}"` : 'Задания находятся на прикрепленных изображениях.'}
Найди ответы и подробные разборы на ${siteUrl}. Убедись, что ответ (поле answer) полностью совпадает с правильным ответом из разбора.`;

  const parts: any[] = [{ text: prompt }];
  
  if (input.base64Images && input.base64Images.length > 0) {
    input.base64Images.forEach(base64 => {
      const base64Data = base64.split(',')[1] || base64;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }, // Повышаем уровень размышления для точности ответов
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
    if (!text) throw new Error("Модель не смогла распознать задания. Попробуйте сделать фото четче.");
    
    const result = JSON.parse(text);
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || 'Решение найдено',
        uri: chunk.web?.uri || '',
      }))
      .filter((s: any) => s.uri) || [];

    const finalResult = {
      tasks: result.tasks || [],
      sources
    };

    // Сохраняем в кэш
    cache.set(cacheKey, finalResult);
    
    return finalResult;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes('429')) {
      throw new Error("Превышен лимит запросов. Пожалуйста, подождите 60 секунд.");
    }
    throw new Error(error.message || "Ошибка при анализе заданий. Проверьте камеру или интернет.");
  }
};

export const chatWithAI = async (
  message: string,
  history: any[],
  images?: string[]
) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY не установлен.");
  
  const ai = new GoogleGenAI({ apiKey });
  const modelName = 'gemini-3-flash-preview';
  
  const systemInstruction = `Ты — умный ИИ-ассистент для помощи в учебе. 
Твоя задача: отвечать на вопросы ученика кратко, понятно и по делу. 
Если прислано фото — проанализируй его и помоги с решением или объяснением.
Будь вежливым, но лаконичным, чтобы экономить токены. Используй форматирование Markdown.`;

  const chat = ai.chats.create({
    model: modelName,
    history: history.length > 0 ? history : undefined,
    config: {
      systemInstruction,
    }
  });

  const parts: any[] = [{ text: message }];
  if (images && images.length > 0) {
    images.forEach(base64 => {
      const base64Data = base64.split(',')[1] || base64;
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    });
  }


  const result = await chat.sendMessageStream({ message: parts });
