export interface Question {
  id: string;
  fieldName: string;
  type: 'string' | 'enum';
  options?: string[];
  conversationalGuide: string;
}

export interface Survey {
  id: string;
  name: string;
  questions: Question[];
}

export interface ParticipantProfile {
  id: string;
  surveyId: string;
  timestamp: number;
  responses: Record<string, string>;
  completeness: number;
}

export interface CoachingOverview {
  surveyName: string;
  totalQuestions: number;
  estimatedDuration: string;
  conversationalApproach: string;
  keyTips: string[];
}

export interface QuestionCoaching {
  questionId: string;
  question: string;
  naturalPhrasing: string[];
  commonMistakes: string[];
  followUpTips: string[];
}
