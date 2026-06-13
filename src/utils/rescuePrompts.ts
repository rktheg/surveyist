import { Question } from '../types/survey';

export const generateRescuePrompt = (question: Question): string => {
  const prompts: Record<string, string> = {
    'Participant Full Name': 'Try: "I don\'t think I caught your name earlier - what should I call you?"',
    'Living Condition': 'Try: "I\'m curious about your living situation - do you live in the city, suburbs, or somewhere more rural?"',
    'Primary Commute Method': 'Try: "One thing I forgot to ask - how do you usually get to work each day?"',
    'Daily Screen Time Usage': 'Try: "Just wondering - would you say you spend most of your day looking at screens, or do you get breaks from that?"'
  };

  return prompts[question.fieldName] || `Try asking naturally about: ${question.fieldName}`;
};
