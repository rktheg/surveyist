import React, { useState } from 'react';
import { Survey } from '../types/survey';
import { Phone, PhoneOff, Volume2 } from 'lucide-react';

interface MockConversationProps {
  survey: Survey;
}

export const MockConversation: React.FC<MockConversationProps> = ({ survey }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([]);

  const startPractice = () => {
    setIsActive(true);
    setCurrentQuestionIndex(0);
    setMessages([
      {
        role: 'ai',
        text: "Hi! I'm here to help you practice conducting this survey. I'll play the role of a participant. Let's begin!",
      },
    ]);
  };

  const endPractice = () => {
    setIsActive(false);
    setMessages([]);
    setCurrentQuestionIndex(0);
  };

  const simulateResponse = () => {
    const question = survey.questions[currentQuestionIndex];
    
    // Simulate user asking the question
    const userMessage = {
      role: 'user' as const,
      text: `So, ${question.fieldName.toLowerCase()}?`,
    };

    // Simulate AI participant response
    let aiResponse = '';
    if (question.type === 'enum' && question.options) {
      aiResponse = question.options[Math.floor(Math.random() * question.options.length)];
    } else {
      aiResponse = `Here's my answer for ${question.fieldName}`;
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: 'ai', text: aiResponse },
    ]);

    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: "Great job! You've completed the practice survey. Would you like to try again?",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Practice Mode</h3>
        <p className="text-sm text-gray-600 mb-4">
          Practice conducting the survey with an AI participant. Click "Start Call" to begin.
        </p>

        <div className="flex gap-3">
          {!isActive ? (
            <button
              onClick={startPractice}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Phone className="w-5 h-5" />
              Start Call
            </button>
          ) : (
            <>
              <button
                onClick={simulateResponse}
                disabled={currentQuestionIndex >= survey.questions.length}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Volume2 className="w-5 h-5" />
                Ask Next Question
              </button>
              <button
                onClick={endPractice}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <PhoneOff className="w-5 h-5" />
                End Call
              </button>
            </>
          )}
        </div>
      </div>

      {/* Conversation Display */}
      {messages.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Indicator */}
      {isActive && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {currentQuestionIndex} / {survey.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(currentQuestionIndex / survey.questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
