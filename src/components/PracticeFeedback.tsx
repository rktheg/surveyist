import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp, Clock, MessageCircle, RotateCcw } from 'lucide-react';

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

interface PracticeFeedbackProps {
  feedback: PracticeFeedbackData;
  onStartNewPractice: () => void;
}

export const PracticeFeedback: React.FC<PracticeFeedbackProps> = ({ 
  feedback, 
  onStartNewPractice 
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Practice Session Complete!</h2>
        <p className="text-gray-600">Here's how you did</p>
      </div>

      {/* Overall Score */}
      <div className={`border rounded-lg p-6 ${getScoreBgColor(feedback.overallScore)}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Performance</h3>
            <p className="text-sm text-gray-600">Based on conversation quality and completeness</p>
          </div>
          <div className={`text-5xl font-bold ${getScoreColor(feedback.overallScore)}`}>
            {feedback.overallScore}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-gray-700">Duration: {feedback.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={16} className="text-gray-500" />
            <span className="text-gray-700">
              Questions: {feedback.questionsAsked}/{feedback.totalQuestions}
            </span>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-600" />
            What You Did Well
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {feedback.improvements.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-yellow-600" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-yellow-600 font-bold mt-0.5">→</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detailed Feedback */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle size={18} className="text-blue-600" />
          Detailed Feedback
        </h3>
        {feedback.detailedFeedback.map((item, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{item.category}</h4>
              <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                {item.score}/100
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{item.feedback}</p>
            {item.suggestions.length > 0 && (
              <div className="bg-blue-50 rounded p-3">
                <p className="text-xs font-semibold text-gray-900 mb-2">Suggestions:</p>
                <ul className="space-y-1">
                  {item.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs text-gray-700 pl-3 relative">
                      <span className="absolute left-0 text-blue-500">•</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onStartNewPractice}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <RotateCcw size={18} />
          <span>Start New Practice Session</span>
        </button>
      </div>
    </div>
  );
};
