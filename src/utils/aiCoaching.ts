import { Survey, CoachingOverview, QuestionCoaching } from '../types/survey';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ VITE_GEMINI_API_KEY not found in .env file');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export const generateCoachingOverview = async (survey: Survey): Promise<CoachingOverview> => {
  const estimatedMinutes = Math.ceil(survey.questions.length * 1.5);
  
  const prompt = `You are an expert survey interviewer coach. Generate coaching guidance for conducting the following survey:

Survey Name: ${survey.name}
Number of Questions: ${survey.questions.length}
Questions:
${survey.questions.map((q, i) => `${i + 1}. ${q.fieldName} (${q.type}${q.options ? `: ${q.options.join(', ')}` : ''})`).join('\n')}

Provide:
1. Exactly 5 key tips for conducting this survey naturally and conversationally
2. A conversational approach description (2-3 sentences) that explains how to conduct this survey as a natural conversation

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "keyTips": ["tip1", "tip2", "tip3", "tip4", "tip5"],
  "conversationalApproach": "description here"
}`;

  try {
    console.log('🤖 Calling Gemini API for coaching overview...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API response received');
    console.log('Raw response:', text);

    // Extract JSON from response (handle markdown code blocks)
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // Find JSON object in text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!parsed.keyTips || !Array.isArray(parsed.keyTips) || parsed.keyTips.length !== 5) {
      throw new Error('Invalid keyTips format');
    }
    if (!parsed.conversationalApproach || typeof parsed.conversationalApproach !== 'string') {
      throw new Error('Invalid conversationalApproach format');
    }

    console.log('✅ Successfully parsed coaching overview');

    return {
      surveyName: survey.name,
      totalQuestions: survey.questions.length,
      estimatedDuration: `${estimatedMinutes}-${estimatedMinutes + 5} minutes`,
      keyTips: parsed.keyTips,
      conversationalApproach: parsed.conversationalApproach
    };
  } catch (error) {
    console.error('❌ Error generating coaching overview:', error);
    
    // Check if it's an API key error
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    }
    
    throw new Error(`Failed to generate coaching overview: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const generateQuestionCoaching = async (survey: Survey): Promise<QuestionCoaching[]> => {
  const prompt = `You are an expert survey interviewer coach. For each question in this survey, provide detailed coaching on how to ask it naturally in conversation.

Survey: ${survey.name}
Questions:
${survey.questions.map((q, i) => `${i + 1}. ${q.fieldName} (${q.type}${q.options ? `: ${q.options.join(', ')}` : ''})`).join('\n')}

For EACH question, provide:
1. 3 natural ways to phrase the question in conversation
2. 2-3 common mistakes to avoid
3. 2-3 follow-up tips for handling unclear responses

IMPORTANT: Respond ONLY with valid JSON array in this exact format:
[
  {
    "questionId": "question_id_here",
    "question": "question text",
    "naturalPhrasing": ["phrase1", "phrase2", "phrase3"],
    "commonMistakes": ["mistake1", "mistake2"],
    "followUpTips": ["tip1", "tip2"]
  }
]`;

  try {
    console.log('🤖 Calling Gemini API for question coaching...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API response received');

    // Extract JSON from response
    let jsonText = text.trim();
    
    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    // Find JSON array in text
    const jsonMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Map to survey questions
    return survey.questions.map((question, index) => {
      const aiCoaching = parsed[index] || {};
      
      return {
        questionId: question.id,
        question: question.fieldName,
        naturalPhrasing: aiCoaching.naturalPhrasing || [
          `Can you tell me about ${question.fieldName.toLowerCase()}?`,
          `I'd like to know about your ${question.fieldName.toLowerCase()}`,
          `Let's talk about ${question.fieldName.toLowerCase()}`
        ],
        commonMistakes: aiCoaching.commonMistakes || [
          "Don't read the question exactly as written",
          "Avoid technical or formal language"
        ],
        followUpTips: aiCoaching.followUpTips || [
          "If the answer is unclear, ask them to elaborate",
          "Paraphrase their answer back to confirm understanding"
        ]
      };
    });
  } catch (error) {
    console.error('❌ Error generating question coaching:', error);
    
    if (error instanceof Error && error.message.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    }
    
    throw new Error(`Failed to generate question coaching: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
