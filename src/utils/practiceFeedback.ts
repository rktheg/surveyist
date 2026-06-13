import { Survey } from '../types/survey';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

interface FeedbackItem {
  category: string;
  score: number;
  feedback: string;
  suggestions: string[];
}

interface PracticeFeedbackData {
  overallScore: number;
  duration: string;
  questionsAsked: number;
  totalQuestions: number;
  strengths: string[];
  improvements: string[];
  detailedFeedback: FeedbackItem[];
}

export const generatePracticeFeedback = (
  messages: Message[],
  survey: Survey,
  collectedData: Record<string, string>,
  callDuration: number
): PracticeFeedbackData => {
  const userMessages = messages.filter(m => m.role === 'user');
  const questionsAsked = Object.keys(collectedData).length;
  const totalQuestions = survey.questions.length;
  const completionRate = (questionsAsked / totalQuestions) * 100;

  // Calculate duration
  const minutes = Math.floor(callDuration / 60);
  const seconds = callDuration % 60;
  const durationStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Analyze conversation quality
  const avgMessageLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
  const hasGreeting = userMessages.some(m => 
    m.content.toLowerCase().includes('hi') || 
    m.content.toLowerCase().includes('hello') ||
    m.content.toLowerCase().includes('hey')
  );
  const hasThankYou = userMessages.some(m => 
    m.content.toLowerCase().includes('thank') ||
    m.content.toLowerCase().includes('appreciate')
  );

  // Calculate scores
  const completionScore = completionRate;
  const conversationScore = calculateConversationScore(userMessages, hasGreeting, hasThankYou);
  const efficiencyScore = calculateEfficiencyScore(callDuration, questionsAsked, totalQuestions);
  const clarityScore = calculateClarityScore(userMessages, avgMessageLength);

  const overallScore = Math.round(
    (completionScore * 0.4) + 
    (conversationScore * 0.3) + 
    (efficiencyScore * 0.2) + 
    (clarityScore * 0.1)
  );

  // Generate strengths
  const strengths: string[] = [];
  if (hasGreeting) strengths.push('Started with a friendly greeting');
  if (hasThankYou) strengths.push('Showed appreciation to the participant');
  if (completionRate === 100) strengths.push('Collected all required information');
  if (avgMessageLength > 20 && avgMessageLength < 100) strengths.push('Asked questions at appropriate length');
  if (callDuration < totalQuestions * 90) strengths.push('Maintained good pacing throughout the conversation');

  // Generate improvements
  const improvements: string[] = [];
  if (!hasGreeting) improvements.push('Start with a warm greeting to make participants comfortable');
  if (!hasThankYou) improvements.push('Remember to thank participants for their time');
  if (completionRate < 100) improvements.push(`Try to gather all ${totalQuestions} pieces of information`);
  if (avgMessageLength < 20) improvements.push('Ask more detailed, conversational questions');
  if (avgMessageLength > 150) improvements.push('Keep questions concise and focused');
  if (callDuration > totalQuestions * 150) improvements.push('Work on pacing - aim for more efficient conversations');

  // Detailed feedback
  const detailedFeedback: FeedbackItem[] = [
    {
      category: 'Survey Completion',
      score: Math.round(completionScore),
      feedback: completionRate === 100 
        ? 'Excellent! You gathered all required information from the participant.'
        : `You collected ${questionsAsked} out of ${totalQuestions} required pieces of information. ${totalQuestions - questionsAsked} questions remain unanswered.`,
      suggestions: completionRate < 100 
        ? [
            'Review the survey questions before starting',
            'Keep track of which questions you\'ve covered',
            'Use natural transitions to move between topics'
          ]
        : ['Maintain this thoroughness in real surveys']
    },
    {
      category: 'Conversation Quality',
      score: conversationScore,
      feedback: conversationScore >= 80
        ? 'Great conversational approach! Your questions felt natural and engaging.'
        : conversationScore >= 60
        ? 'Good effort, but there\'s room to make the conversation more natural.'
        : 'Focus on making the conversation feel less like an interrogation and more like a friendly chat.',
      suggestions: conversationScore < 80
        ? [
            'Use open-ended questions to encourage detailed responses',
            'Show genuine interest in the participant\'s answers',
            'Use follow-up questions to dig deeper',
            'Avoid reading questions verbatim from the survey'
          ]
        : ['Keep up the natural, conversational tone']
    },
    {
      category: 'Time Efficiency',
      score: efficiencyScore,
      feedback: efficiencyScore >= 80
        ? 'Excellent pacing! You gathered information efficiently without rushing.'
        : efficiencyScore >= 60
        ? 'Decent pacing, but you could be more efficient with your time.'
        : 'The conversation took longer than ideal. Work on being more concise.',
      suggestions: efficiencyScore < 80
        ? [
            'Plan your questions in advance',
            'Avoid unnecessary tangents',
            'Be direct while remaining friendly',
            'Practice transitioning smoothly between questions'
          ]
        : ['Maintain this efficient approach']
    },
    {
      category: 'Question Clarity',
      score: clarityScore,
      feedback: clarityScore >= 80
        ? 'Your questions were clear and easy to understand.'
        : clarityScore >= 60
        ? 'Most questions were clear, but some could be more concise.'
        : 'Work on making your questions clearer and more focused.',
      suggestions: clarityScore < 80
        ? [
            'Ask one thing at a time',
            'Use simple, everyday language',
            'Avoid jargon or technical terms',
            'Rephrase if the participant seems confused'
          ]
        : ['Continue asking clear, focused questions']
    }
  ];

  return {
    overallScore,
    duration: durationStr,
    questionsAsked,
    totalQuestions,
    strengths,
    improvements,
    detailedFeedback
  };
};

const calculateConversationScore = (
  userMessages: Message[],
  hasGreeting: boolean,
  hasThankYou: boolean
): number => {
  let score = 50; // Base score

  if (hasGreeting) score += 15;
  if (hasThankYou) score += 15;

  // Check for conversational phrases
  const conversationalPhrases = [
    'could you', 'would you', 'can you tell me', 'i\'d like to know',
    'i\'m curious', 'interesting', 'that\'s great', 'i see'
  ];

  const hasConversationalTone = userMessages.some(m =>
    conversationalPhrases.some(phrase => m.content.toLowerCase().includes(phrase))
  );

  if (hasConversationalTone) score += 20;

  return Math.min(score, 100);
};

const calculateEfficiencyScore = (
  duration: number,
  questionsAsked: number,
  totalQuestions: number
): number => {
  const idealTimePerQuestion = 60; // 60 seconds per question
  const idealTotalTime = totalQuestions * idealTimePerQuestion;
  
  const timeDifference = Math.abs(duration - idealTotalTime);
  const efficiencyRatio = 1 - (timeDifference / idealTotalTime);
  
  let score = Math.max(0, efficiencyRatio * 100);
  
  // Bonus for completing all questions
  if (questionsAsked === totalQuestions) {
    score = Math.min(100, score + 10);
  }
  
  return Math.round(score);
};

const calculateClarityScore = (
  userMessages: Message[],
  avgMessageLength: number
): number => {
  let score = 70; // Base score

  // Ideal message length is between 20-100 characters
  if (avgMessageLength >= 20 && avgMessageLength <= 100) {
    score += 20;
  } else if (avgMessageLength < 20) {
    score -= 10; // Too short
  } else if (avgMessageLength > 150) {
    score -= 15; // Too long
  }

  // Check for question marks (indicates asking questions)
  const questionCount = userMessages.filter(m => m.content.includes('?')).length;
  const questionRatio = questionCount / userMessages.length;
  
  if (questionRatio > 0.5) {
    score += 10;
  }

  return Math.min(Math.max(score, 0), 100);
};
