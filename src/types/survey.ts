export interface Question {
  id: string;
  fieldName: string;
  type: 'string' | 'enum';
  options?: string[];
  conversationalGuide?: string;
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

export interface TranscriptSegment {
  id: string;
  timestamp: number;
  text: string;
  extractedData?: Record<string, string>;
}

export interface CoachingOverview {
  surveyName: string;
  totalQuestions: number;
  estimatedDuration: string;
  keyTips: string[];
  conversationalApproach: string;
}

export interface QuestionCoaching {
  questionId: string;
  question: string;
  naturalPhrasing: string[];
  commonMistakes: string[];
  followUpTips: string[];
}

export interface RecordingAnalysis {
  score: number;
  answeredQuestions: string[];
  unansweredQuestions: string[];
  unclearQuestions: UnclearQuestion[];
  extractedResponses: Record<string, string>;
}

export interface UnclearQuestion {
  questionId: string;
  question: string;
  partialInfo?: string;
  clarificationNeeded: string;
}
