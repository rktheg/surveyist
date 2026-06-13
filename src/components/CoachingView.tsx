import React, { useState, useEffect } from 'react';
import { Survey, CoachingOverview, QuestionCoaching } from '../types/survey';
import { generateCoachingOverview, generateQuestionCoaching } from '../utils/aiCoaching';
import { BookOpen, MessageSquare, Mic, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react';
import { MockConversation } from './MockConversation';

interface CoachingViewProps {
  survey: Survey;
}

type Tab = 'overview' | 'questions' | 'practice';

export const CoachingView: React.FC<CoachingViewProps> = ({ survey }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [overview, setOverview] = useState<CoachingOverview | null>(null);
  const [questionCoaching, setQuestionCoaching] = useState<QuestionCoaching[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCoaching();
  }, [survey]);

  const loadCoaching = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('📊 Loading AI coaching for survey:', survey.name);
      
      const [overviewData, questionsData] = await Promise.all([
        generateCoachingOverview(survey),
        generateQuestionCoaching(survey)
      ]);
      
      setOverview(overviewData);
      setQuestionCoaching(questionsData);
      
      console.log('✅ AI coaching loaded successfully');
    } catch (err) {
      console.error('❌ Error loading coaching:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate AI coaching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Generating AI coaching guidance...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 10-20 seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-semibold mb-2">Error Loading AI Coaching</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            {error.includes('API key') && (
              <div className="bg-red-100 border border-red-300 rounded p-3 mb-4 text-sm">
                <p className="font-medium text-red-800 mb-1">To fix this:</p>
                <ol className="list-decimal list-inside space-y-1 text-red-700">
                  <li>Get a Gemini API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a></li>
                  <li>Add it to your <code className="bg-red-200 px-1 rounded">.env</code> file as <code className="bg-red-200 px-1 rounded">VITE_GEMINI_API_KEY=your_key_here</code></li>
                  <li>Restart the dev server</li>
                </ol>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={loadCoaching}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            activeTab === 'questions'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Questions
        </button>
        <button
          onClick={() => setActiveTab('practice')}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            activeTab === 'practice'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mic className="w-5 h-5" />
          Practice
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{overview.surveyName}</h2>
            <div className="flex gap-6 text-sm text-gray-600">
              <span>📋 {overview.totalQuestions} questions</span>
              <span>⏱️ {overview.estimatedDuration}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversational Approach</h3>
            <p className="text-gray-700 leading-relaxed">{overview.conversationalApproach}</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Tips</h3>
            <ul className="space-y-3">
              {overview.keyTips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {questionCoaching.map((coaching) => (
            <div
              key={coaching.questionId}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleQuestion(coaching.questionId)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{coaching.question}</span>
                {expandedQuestions.has(coaching.questionId) ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {expandedQuestions.has(coaching.questionId) && (
                <div className="px-6 pb-6 space-y-4 border-t border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Natural Ways to Ask</h4>
                    <ul className="space-y-2">
                      {coaching.naturalPhrasing.map((phrase, index) => (
                        <li key={index} className="text-gray-700 pl-4 border-l-2 border-green-300">
                          "{phrase}"
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Common Mistakes to Avoid</h4>
                    <ul className="space-y-2">
                      {coaching.commonMistakes.map((mistake, index) => (
                        <li key={index} className="text-gray-700 pl-4 border-l-2 border-red-300">
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Follow-up Tips</h4>
                    <ul className="space-y-2">
                      {coaching.followUpTips.map((tip, index) => (
                        <li key={index} className="text-gray-700 pl-4 border-l-2 border-blue-300">
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <MockConversation survey={survey} />
      )}
    </div>
  );
};
