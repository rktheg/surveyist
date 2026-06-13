import React, { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { Survey } from '../types/survey';

interface MockConversationProps {
  survey: Survey;
}

export const MockConversation: React.FC<MockConversationProps> = ({ survey }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleStart = () => {
    setIsActive(true);
    setCurrentIndex(0);
  };

  const handleStop = () => {
    setIsActive(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Practice Conversation
        </h3>
        <p className="text-gray-600 mb-6">
          Practice the survey as a natural conversation. The AI will guide you through each question.
        </p>

        {!isActive ? (
          <button
            onClick={handleStart}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Play size={20} />
            Start Practice
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 font-medium">
                Question {currentIndex + 1} of {survey.questions.length}
              </p>
              <p className="text-blue-800 mt-2">
                {survey.questions[currentIndex]?.conversationalGuide}
              </p>
            </div>

            <button
              onClick={handleStop}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
            >
              <Square size={20} />
              Stop Practice
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
