import { GoogleGenerativeAI } from '@google/generative-ai';
import { Survey } from '../types/survey';

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }
  return apiKey;
};

const genAI = new GoogleGenerativeAI(getApiKey());

export interface LiveAnalysisResult {
  [fieldName: string]: {
    value: string;
    confidence: 'high' | 'medium' | 'low';
    needsClarification: boolean;
  };
}

export const analyzeLiveTranscript = async (
  transcript: string,
  survey: Survey
): Promise<LiveAnalysisResult> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze this conversation transcript and extract answers to survey questions.

Transcript:
"${transcript}"

Survey Questions:
${survey.questions.map((q, i) => `${i + 1}. ${q.fieldName} (${q.type}${q.options ? `, options: ${q.options.join(', ')}` : ''})`).join('\n')}

For each question, extract the answer if mentioned. Return JSON:
{
  "fieldName": {
    "value": "extracted answer or empty string",
    "confidence": "high|medium|low",
    "needsClarification": boolean
  }
}

Only include fields that were mentioned in the transcript.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {};
  }

  return JSON.parse(jsonMatch[0]);
};
