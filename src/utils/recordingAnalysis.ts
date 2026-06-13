import { Survey, RecordingAnalysis, UnclearQuestion } from '../types/survey';
import { callGemini } from '../config/gemini';

interface ParsedResponse {
  [fieldName: string]: string;
}

const parseTranscriptWithAI = async (
  transcript: string,
  questions: Survey['questions']
): Promise<ParsedResponse> => {
  const prompt = `You are analyzing a survey interview transcript. Extract the participant's answers to each question.

Questions:
${questions.map((q, i) => `${i + 1}. ${q.fieldName} (${q.type}${q.options ? `: ${q.options.join(', ')}` : ''})`).join('\n')}

Transcript:
${transcript}

For each question, extract the participant's answer. If the answer is unclear or not mentioned, use "UNCLEAR" or "NOT_ANSWERED".

Format as JSON:
{
  "Question Field Name": "extracted answer",
  ...
}`;

  try {
    const response = await callGemini(prompt, {
      temperature: 0.3,
      maxOutputTokens: 1024
    });

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parsing transcript with AI:', error);
    return {};
  }
};

export const analyzeRecording = async (
  transcript: string,
  survey: Survey
): Promise<RecordingAnalysis> => {
  const extractedResponses = await parseTranscriptWithAI(transcript, survey.questions);
  
  const answeredQuestions: string[] = [];
  const unansweredQuestions: string[] = [];
  const unclearQuestions: UnclearQuestion[] = [];

  survey.questions.forEach(question => {
    const response = extractedResponses[question.fieldName];
    
    if (!response || response === 'NOT_ANSWERED') {
      unansweredQuestions.push(question.fieldName);
    } else if (response === 'UNCLEAR') {
      unclearQuestions.push({
        questionId: question.id,
        question: question.fieldName,
        clarificationNeeded: 'The answer was mentioned but is unclear. Please provide a clear response.'
      });
    } else {
      // Validate enum responses
      if (question.type === 'enum' && question.options) {
        const isValidOption = question.options.some(
          opt => opt.toLowerCase() === response.toLowerCase()
        );
        
        if (isValidOption) {
          answeredQuestions.push(question.fieldName);
        } else {
          unclearQuestions.push({
            questionId: question.id,
            question: question.fieldName,
            partialInfo: response,
            clarificationNeeded: `The response "${response}" doesn't match the expected options: ${question.options.join(', ')}. Please clarify which option best fits.`
          });
        }
      } else {
        answeredQuestions.push(question.fieldName);
      }
    }
  });

  const score = Math.round(
    (answeredQuestions.length / survey.questions.length) * 100
  );

  return {
    score,
    answeredQuestions,
    unansweredQuestions,
    unclearQuestions,
    extractedResponses
  };
};
