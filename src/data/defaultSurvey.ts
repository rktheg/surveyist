import { Survey } from '../types/survey';

export const defaultSurvey: Survey = {
  id: 'demo-survey-001',
  name: 'General Demographic & Lifestyle Assessment',
  questions: [
    {
      id: 'q1',
      fieldName: 'Participant Full Name',
      type: 'string',
      conversationalGuide: 'Start naturally: "Before we begin, I\'d love to know what to call you - what\'s your name?"'
    },
    {
      id: 'q2',
      fieldName: 'Living Condition',
      type: 'enum',
      options: ['Urban Apartment', 'Suburban', 'Rural'],
      conversationalGuide: 'Instead of asking directly, try: "Tell me about where you live - are you in the city, suburbs, or more out in the countryside?"'
    },
    {
      id: 'q3',
      fieldName: 'Primary Commute Method',
      type: 'enum',
      options: ['Public Transit', 'Personal Vehicle', 'Remote'],
      conversationalGuide: 'Weave it in casually: "How do you usually get to work? Do you drive, take the bus or train, or are you working from home these days?"'
    },
    {
      id: 'q4',
      fieldName: 'Daily Screen Time Usage',
      type: 'enum',
      options: ['High', 'Moderate', 'Low'],
      conversationalGuide: 'Make it conversational: "Are you stuck staring at a screen for most of your workday, or do you get to move around and do other things?"'
    }
  ]
};
