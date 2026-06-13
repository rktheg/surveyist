import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Use gemini-1.5-flash model (correct initialization)
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash'
  });
};

export interface GeminiGenerationConfig {
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

export const callGemini = async (
  prompt: string,
  config?: GeminiGenerationConfig
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured');
  }

  const model = getGeminiModel();

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: config || {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
