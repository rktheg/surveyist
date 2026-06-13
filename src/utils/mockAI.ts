import { Survey } from '../types/survey';

interface AIResponse {
  response: string;
  extractedData?: Record<string, string>;
  questionAnswered: boolean;
}

const participantPersona = {
  name: 'Alex Johnson',
  livingCondition: 'Urban',
  commuteMethod: 'Public Transportation',
  screenTime: 'High (8-10 hours)',
  personality: 'friendly and conversational'
};

export const generateAIResponse = (
  userInput: string,
  survey: Survey,
  currentQuestionIndex: number,
  collectedData: Record<string, string>
): AIResponse => {
  const lowerInput = userInput.toLowerCase();
  const currentQuestion = survey.questions[currentQuestionIndex];
  
  // Check if user is asking about name
  if (lowerInput.includes('name') && !collectedData['Participant Full Name']) {
    return {
      response: "Sure! My name is Alex Johnson. Nice to meet you!",
      extractedData: { 'Participant Full Name': participantPersona.name },
      questionAnswered: true
    };
  }

  // Check if user is asking about living condition
  if ((lowerInput.includes('live') || lowerInput.includes('area') || lowerInput.includes('urban') || lowerInput.includes('suburban') || lowerInput.includes('rural')) && !collectedData['Living Condition']) {
    return {
      response: "I live in the city, so it's pretty urban. Lots of apartments and buildings around here. I like the convenience of having everything nearby!",
      extractedData: { 'Living Condition': participantPersona.livingCondition },
      questionAnswered: true
    };
  }

  // Check if user is asking about commute
  if ((lowerInput.includes('commute') || lowerInput.includes('work') || lowerInput.includes('get to') || lowerInput.includes('transportation') || lowerInput.includes('travel')) && !collectedData['Primary Commute Method']) {
    return {
      response: "I usually take the bus or train to work. Public transportation is really convenient in the city, and I don't have to worry about parking. It takes about 30 minutes each way.",
      extractedData: { 'Primary Commute Method': participantPersona.commuteMethod },
      questionAnswered: true
    };
  }

  // Check if user is asking about screen time
  if ((lowerInput.includes('screen') || lowerInput.includes('phone') || lowerInput.includes('computer') || lowerInput.includes('device')) && !collectedData['Daily Screen Time Usage']) {
    return {
      response: "Oh wow, I'm definitely on screens a lot! Between work on my computer all day and then scrolling on my phone in the evening, I'd say probably 8-10 hours total. Maybe even more on some days. I know it's a lot!",
      extractedData: { 'Daily Screen Time Usage': participantPersona.screenTime },
      questionAnswered: true
    };
  }

  // Greeting responses
  if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
    return {
      response: "Hey! How's it going? I'm happy to help with your survey.",
      questionAnswered: false
    };
  }

  // Thank you responses
  if (lowerInput.includes('thank') || lowerInput.includes('thanks')) {
    return {
      response: "You're welcome! Happy to help. Is there anything else you'd like to know?",
      questionAnswered: false
    };
  }

  // If user asks about something already answered
  const answeredQuestions = Object.keys(collectedData);
  for (const answeredQ of answeredQuestions) {
    if (lowerInput.includes(answeredQ.toLowerCase().split(' ')[0])) {
      return {
        response: `I already mentioned that earlier - ${collectedData[answeredQ]}. Did you need me to clarify something about it?`,
        questionAnswered: false
      };
    }
  }

  // Provide hints if user seems stuck
  const unansweredQuestions = survey.questions.filter(
    q => !collectedData[q.fieldName]
  );

  if (unansweredQuestions.length > 0) {
    const nextQuestion = unansweredQuestions[0];
    const hints: Record<string, string> = {
      'Participant Full Name': "By the way, I don't think you've asked my name yet. Would you like to know?",
      'Living Condition': "I'm curious - are you going to ask about where I live? I have some interesting thoughts on that!",
      'Primary Commute Method': "Oh, I could tell you about how I get around if you're interested!",
      'Daily Screen Time Usage': "I've been thinking about my screen time lately. Want to hear about it?"
    };

    return {
      response: hints[nextQuestion.fieldName] || "I'm here to answer your questions! What would you like to know?",
      questionAnswered: false
    };
  }

  // All questions answered
  if (Object.keys(collectedData).length === survey.questions.length) {
    return {
      response: "I think we've covered everything! Thanks for practicing with me. You did a great job keeping the conversation natural!",
      questionAnswered: false
    };
  }

  // Default response
  return {
    response: "That's an interesting question! Could you rephrase that? I want to make sure I understand what you're asking.",
    questionAnswered: false
  };
};
