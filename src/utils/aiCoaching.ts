import { GoogleGenerativeAI } from '@google/generative-ai';
import { Survey, CoachingOverview, QuestionCoaching } from '../types/survey';

const getApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
  }
  return apiKey;
};

const genAI = new GoogleGenerativeAI(getApiKey());

export const generateCoachingOverview = async (survey: Survey): Promise<CoachingOverview> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a survey coaching expert. Analyze this survey and provide coaching guidance.

Survey: ${survey.name}
Questions:
${survey.questions.map((q, i) => `${i + 1}. ${q.fieldName} (${q.type})`).join('\n')}

Provide a JSON response with:
{
  "surveyName": "string",
  "totalQuestions": number,
  "estimatedDuration": "string (e.g., '5-7 minutes')",
  "conversationalApproach": "string (2-3 sentences on how to conduct this survey naturally)",
  "keyTips": ["tip1", "tip2", "tip3", "tip4", "tip5"]
}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
};

export const generateQuestionCoaching = async (survey: Survey): Promise<QuestionCoaching[]> => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a survey coaching expert. For each question in this survey, provide detailed coaching.

Questions:
${survey.questions.map((q, i) => `${i + 1}. ${q.fieldName} (${q.type}${q.options ? `, options: ${q.options.join(', ')}` : ''})`).join('\n')}

For EACH question, provide a JSON object with:
{
  "questionId": "string",
  "question": "string",
  "naturalPhrasing": ["phrase1", "phrase2", "phrase3"],
  "commonMistakes": ["mistake1", "mistake2", "mistake3"],
  "followUpTips": ["tip1", "tip2", "tip3"]
}

Return an array of these objects, one for each question.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error('Failed to parse AI response');
  }

  return JSON.parse(jsonMatch[0]);
};
