import React, { useState } from 'react';
import { Upload, FileText, Zap, ArrowRight, File, X, Check, Edit2 } from 'lucide-react';
import { Survey, Question } from '../types/survey';

interface HomeViewProps {
  onSurveyUpload: (survey: Survey) => void;
  hasSurvey: boolean;
}

interface ParsedQuestion {
  fieldName: string;
  type: 'string' | 'enum';
  options?: string[];
}

export const HomeView: React.FC<HomeViewProps> = ({ onSurveyUpload, hasSurvey }) => {
  const [surveyText, setSurveyText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const parseQuestions = (text: string): ParsedQuestion[] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      const trimmed = line.trim();
      
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

      return {
        fieldName,
        type,
        options
      };
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    try {
      const text = await file.text();
      setSurveyText(text);
      
      const questions = parseQuestions(text);
      setParsedQuestions(questions);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Failed to read file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextProcess = () => {
    if (!surveyText.trim()) return;

    setIsProcessing(true);
    const questions = parseQuestions(surveyText);
    setParsedQuestions(questions);
    setShowConfirmation(true);
    setIsProcessing(false);
  };

  const handleConfirm = () => {
    const questions: Question[] = parsedQuestions.map((q, index) => ({
      id: `q${index + 1}`,
      fieldName: q.fieldName,
      type: q.type,
      options: q.options,
      conversationalGuide: `Ask naturally: "${q.fieldName}"`
    }));

    const survey: Survey = {
      id: `survey-${Date.now()}`,
      name: 'Custom Survey',
      questions
    };

    onSurveyUpload(survey);
    setShowConfirmation(false);
    setSurveyText('');
    setParsedQuestions([]);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const q = parsedQuestions[index];
    setEditValue(q.options ? `${q.fieldName} (${q.options.join(', ')})` : q.fieldName);
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const updated = [...parsedQuestions];
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

    updated[editingIndex] = { fieldName, type, options };
    setParsedQuestions(updated);
    setEditingIndex(null);
    setEditValue('');
  };

  const handleRemove = (index: number) => {
    setParsedQuestions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Hero Section */}
      <div className="text-center mb-8 pt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <Zap className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Surveyist
        </h1>
        <p className="text-gray-600 text-lg">
          AI-Powered Survey Coaching
        </p>
      </div>

      {/* Survey Input Card */}
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Upload Survey
            </h2>
            <p className="text-sm text-gray-600">
              Paste questions or upload a file
            </p>
          </div>
        </div>

        {/* File Upload Button */}
        <div className="mb-4">
          <label className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer flex items-center justify-center gap-3 group">
            <File className="text-gray-400 group-hover:text-blue-500" size={24} />
            <span className="text-gray-600 group-hover:text-blue-600 font-medium">
              Choose File (.txt, .csv, etc.)
            </span>
            <input
              type="file"
              accept=".txt,.csv,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or paste text</span>
          </div>
        </div>

        <textarea
          value={surveyText}
          onChange={(e) => setSurveyText(e.target.value)}
          placeholder="Example:&#10;Full Name&#10;Age (18-25, 26-35, 36-45, 46+)&#10;Occupation&#10;Living Situation (Urban, Suburban, Rural)"
          className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
        />

        <button
          onClick={handleTextProcess}
          disabled={!surveyText.trim() || isProcessing}
          className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload size={20} />
              <span>Process Survey</span>
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
            <Zap className="text-green-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">AI Coaching</h3>
          <p className="text-xs text-gray-600">
            Get trained on each question
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-soft border border-gray-100">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
            <FileText className="text-purple-600" size={20} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Smart Analysis</h3>
          <p className="text-xs text-gray-600">
            Automatic response scoring
          </p>
        </div>
      </div>

      {/* Status */}
      {hasSurvey && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <p className="text-sm text-green-800 font-medium">
            Survey loaded - Ready to coach!
          </p>
        </div>
      )}

      {/* Parsing Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm Parsed Questions
              </h3>
              <p className="text-sm text-gray-600">
                Review and edit the extracted questions before proceeding
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {parsedQuestions.map((question, index) => (
                <div
                  key={index}
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

              {parsedQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions found. Please check your input.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setParsedQuestions([]);
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={parsedQuestions.length === 0}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
