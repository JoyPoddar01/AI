import { GoogleGenAI, Type } from "@google/genai";
import { StudyRequest, OutputType } from '../types';
import { EDU_BOT_SYSTEM_INSTRUCTION } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getModelForTask = (type: OutputType) => {
  // Use Flash for speed on simple summaries, Pro for complex reasoning like Quizzes/Feedback
  if (type === OutputType.QUIZ || type === OutputType.FEEDBACK) {
    return 'gemini-3-pro-preview';
  }
  return 'gemini-2.5-flash';
};

const getResponseSchema = (type: OutputType) => {
  if (type === OutputType.FLASHCARDS) {
    return {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          front: { type: Type.STRING },
          back: { type: Type.STRING },
        },
        required: ['front', 'back'],
      },
    };
  }
  
  if (type === OutputType.QUIZ) {
    return {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
        },
        required: ['question', 'options', 'correctIndex', 'explanation'],
      },
    };
  }

  return undefined; // Text/Markdown response for Summary and Feedback
};

export const generateStudyContent = async (request: StudyRequest): Promise<string> => {
  const modelName = getModelForTask(request.type);
  
  const prompt = `
    Topic: ${request.topic}
    Level: ${request.level}
    Output Type: ${request.type}
    Additional Details: ${request.details || 'None'}
    
    Please generate the content now.
  `;

  const responseSchema = getResponseSchema(request.type);
  const mimeType = responseSchema ? "application/json" : "text/plain";

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: EDU_BOT_SYSTEM_INSTRUCTION,
        responseMimeType: mimeType,
        responseSchema: responseSchema,
      },
    });

    return response.text || "No content generated.";
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate content. Please check your API key and try again.");
  }
};
