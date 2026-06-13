import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Survey, UnclearQuestion } from '../types/survey';

interface ClarificationModalProps {
  unclearQuestions: UnclearQuestion[];
  unansweredQuestions: string[];
  survey: Survey;
  onComplete: (responses: Record<string, string>) => void;
  onClose: () => void;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  unclearQuestions,
  unansweredQuestions,
  survey,
  onComplete,
  onClose,
}) => {
  const [responses, setResponses] = useState<Record<string, string>>({});

  const allQuestions = [
    ...unclearQuestions.map(q => ({
      id: q.questionId,
      text: q.question,
      type: 'unclear' as const,
      hint: q.clarificationNeeded,
    })),
    ...unansweredQuestions.map(q => {
      const question = survey.questions.find(sq => sq.fieldName === q);
      return {
        id: question?.id || q,
        text: q,
        type: 'missing' as const,
        options: question?.options,
      };
    }),
  ];

  const handleSubmit = () => {
    onComplete(responses);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Clarify Responses</h3>
            <p className="text-sm text-gray-600 mt-1">
              Please provide the missing or unclear information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {allQuestions.map((question) => (
            <div key={question.id} className="space-y-2">
              <label className="block">
                <div className="flex items-start gap-2 mb-2">
                  <span
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      question.type === 'unclear'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {question.type === 'unclear' ? '⚠' : '✗'}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{question.text}</span>
                    {question.type === 'unclear' && question.hint && (
                      <p className="text-sm text-gray-600 mt-1">{question.hint}</p>
                    )}
                  </div>
                </div>

                {question.options ? (
                  <select
                    value={responses[question.text] || ''}
                    onChange={(e) =>
                      setResponses({ ...responses, [question.text]: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option...</option>
                    {question.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={responses[question.text] || ''}
                    onChange={(e) =>
                      setResponses({ ...responses, [question.text]: e.target.value })
                    }
                    placeholder="Enter your response..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              </label>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};
