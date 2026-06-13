import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';
import { Survey } from '../types/survey';

interface PracticeViewProps {
  survey: Survey;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ survey }) => {
  const [isPracticing, setIsPracticing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;

  const handleStart = () => {
    setIsPracticing(true);
    setCurrentQuestionIndex(0);
    setPracticeAnswers({});
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsPracticing(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    setPracticeAnswers(prev => ({
      ...prev,
      [currentQuestion.fieldName]: value
    }));
  };

  const handleReset = () => {
    setIsPracticing(false);
    setCurrentQuestionIndex(0);
    setPracticeAnswers({});
  };

  if (!isPracticing) {
    return (
      <div className="p-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Practice Mode</h2>
          <p className="text-gray-600">
            Practice answering survey questions to prepare for the real conversation
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Go through each question at your own pace</li>
            <li>• Type your answers to practice your responses</li>
            <li>• Review and refine your answers</li>
            <li>• Get comfortable with the survey flow</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Survey Progress</span>
            <span className="text-sm text-gray-500">
              {survey.questions.length} questions
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors"
        >
          <Play size={20} />
          Start Practice Session
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            Question {currentQuestionIndex + 1} of {survey.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="mb-4">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
            {currentQuestion.type}
          </span>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">
            {currentQuestion.text}
          </h3>
        </div>

        {currentQuestion.type === 'multiple_choice' && currentQuestion.options ? (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerChange(option)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  practiceAnswers[currentQuestion.fieldName] === option
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={practiceAnswers[currentQuestion.fieldName] || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        )}

        {practiceAnswers[currentQuestion.fieldName] && (
          <div className="mt-4 flex items-center gap-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm font-medium">Answer recorded</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex-1 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <button
          onClick={handleNext}
          className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          {currentQuestionIndex === survey.questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>

      <button
        onClick={handleReset}
        className="w-full mt-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw size={16} />
        Reset Practice
      </button>
    </div>
  );
};
