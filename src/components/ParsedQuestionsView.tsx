import React, { useState } from 'react';
import { Check, X, Edit2 } from 'lucide-react';
import { Survey } from '../types/survey';

interface ParsedQuestionsViewProps {
  survey: Survey;
  onConfirm: (survey: Survey) => void;
  onBack: () => void;
}

export const ParsedQuestionsView: React.FC<ParsedQuestionsViewProps> = ({ 
  survey, 
  onConfirm, 
  onBack 
}) => {
  const [editedSurvey, setEditedSurvey] = useState(survey);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const q = editedSurvey.questions[index];
    setEditValue(q.options ? `${q.fieldName} (${q.options.join(', ')})` : q.fieldName);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const trimmed = editValue.trim();
    let type: 'string' | 'enum' = 'string';
    let options: string[] | undefined;
    
    if (trimmed.includes('(') && trimmed.includes(')')) {
      type = 'enum';
      const optionsMatch = trimmed.match(/\((.*?)\)/);
      if (optionsMatch) {
        options = optionsMatch[1].split(',').map(opt => opt.trim());
      }
    }

    const fieldName = trimmed.replace(/\(.*?\)/, '').trim();

    const updatedQuestions = [...editedSurvey.questions];
    updatedQuestions[editingIndex] = {
      ...updatedQuestions[editingIndex],
      fieldName,
      type,
      options,
      conversationalGuide: `Ask naturally: "${fieldName}"`
    };

    setEditedSurvey({
      ...editedSurvey,
      questions: updatedQuestions
    });

    setEditingIndex(null);
    setEditValue('');
  };

  const handleRemove = (index: number) => {
    const updatedQuestions = editedSurvey.questions.filter((_, i) => i !== index);
    setEditedSurvey({
      ...editedSurvey,
      questions: updatedQuestions
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Questions</h2>
        <p className="text-gray-600">
          Edit or remove questions before proceeding
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {editedSurvey.questions.map((question, index) => (
          <div
            key={question.id}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            {editingIndex === index ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center gap-1"
                  >
                    <Check size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingIndex(null);
                      setEditValue('');
                    }}
                    className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                      Q{index + 1}
                    </span>
                    <span className="text-xs text-gray-500">
                      {question.type === 'enum' ? 'Multiple Choice' : 'Text'}
                    </span>
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    {question.fieldName}
                  </p>
                  {question.options && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {question.options.map((opt, i) => (
                        <span
                          key={i}
                          className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                        >
                          {opt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(index)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => onConfirm(editedSurvey)}
          disabled={editedSurvey.questions.length === 0}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Check size={20} />
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};
