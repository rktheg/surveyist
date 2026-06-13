import React, { useState } from 'react';
import { Survey, RecordingAnalysis } from '../types/survey';
import { analyzeRecording } from '../utils/recordingAnalysis';
import { Mic, Square, Loader2 } from 'lucide-react';
import { ClarificationModal } from './ClarificationModal';

interface RecordingViewProps {
  survey: Survey;
  onSaveProfile: (responses: Record<string, string>) => void;
}

export const RecordingView: React.FC<RecordingViewProps> = ({ survey, onSaveProfile }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<RecordingAnalysis | null>(null);
  const [showClarification, setShowClarification] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  React.useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setAnalysis(null);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setAnalyzing(true);

    // Mock transcript for now - will be replaced with real speech-to-text
    const mockTranscript = `
      Hi, my name is Alex Johnson. I live in an urban area, specifically in the city center. 
      For my commute, I usually take public transportation - mostly the bus and sometimes the train.
      As for screen time, I'd say I'm on screens quite a bit, probably around 8-10 hours a day 
      between work and personal use.
    `;

    try {
      const result = await analyzeRecording(mockTranscript, survey);
      setAnalysis(result);
      
      if (result.unclearQuestions.length > 0 || result.unansweredQuestions.length > 0) {
        setShowClarification(true);
      }
    } catch (error) {
      console.error('Error analyzing recording:', error);
      alert('Failed to analyze recording. Please check your API key and try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClarificationComplete = (responses: Record<string, string>) => {
    if (!analysis) return;

    const updatedResponses = { ...analysis.extractedResponses, ...responses };
    onSaveProfile(updatedResponses);
    setShowClarification(false);
    alert('Profile saved successfully!');
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Recording Controls */}
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
            {isRecording ? (
              <div className="relative">
                <Mic className="w-16 h-16 text-white animate-pulse" />
                <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-75" />
              </div>
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </div>

          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {formatTime(recordingTime)}
            </div>
            {isRecording && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="font-medium">Recording in progress...</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={analyzing}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop Recording
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Loading */}
      {analyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-blue-900 font-medium">Analyzing recording with AI...</span>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !analyzing && (
        <div className="space-y-4">
          {/* Score Card */}
          <div className={`rounded-lg p-6 border ${getScoreBgColor(analysis.score)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Completion Score</h3>
                <p className="text-sm text-gray-600">
                  {analysis.answeredQuestions.length} of {survey.questions.length} questions answered
                </p>
              </div>
              <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}%
              </div>
            </div>
          </div>

          {/* Answered Questions */}
          {analysis.answeredQuestions.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                Answered Questions ({analysis.answeredQuestions.length})
              </h3>
              <ul className="space-y-2">
                {analysis.answeredQuestions.map((question) => (
                  <li key={question} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 mt-1">✓</span>
                    <div>
                      <div className="font-medium">{question}</div>
                      <div className="text-sm text-gray-600">
                        {analysis.extractedResponses[question]}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unclear Questions */}
          {analysis.unclearQuestions.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                Unclear Responses ({analysis.unclearQuestions.length})
              </h3>
              <ul className="space-y-3">
                {analysis.unclearQuestions.map((item) => (
                  <li key={item.questionId} className="flex items-start gap-3 text-gray-700">
                    <span className="text-yellow-500 mt-1">⚠</span>
                    <div>
                      <div className="font-medium">{item.question}</div>
                      {item.partialInfo && (
                        <div className="text-sm text-gray-600 mt-1">
                          Detected: "{item.partialInfo}"
                        </div>
                      )}
                      <div className="text-sm text-yellow-700 mt-1">
                        {item.clarificationNeeded}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Questions */}
          {analysis.unansweredQuestions.length > 0 && (
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                Missing Responses ({analysis.unansweredQuestions.length})
              </h3>
              <ul className="space-y-2">
                {analysis.unansweredQuestions.map((question) => (
                  <li key={question} className="flex items-start gap-3 text-gray-700">
                    <span className="text-red-500 mt-1">✗</span>
                    <span className="font-medium">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Clarification Button */}
          {(analysis.unclearQuestions.length > 0 || analysis.unansweredQuestions.length > 0) && (
            <button
              onClick={() => setShowClarification(true)}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Provide Missing Information
            </button>
          )}
        </div>
      )}

      {/* Clarification Modal */}
      {showClarification && analysis && (
        <ClarificationModal
          unclearQuestions={analysis.unclearQuestions}
          unansweredQuestions={analysis.unansweredQuestions}
          survey={survey}
          onComplete={handleClarificationComplete}
          onClose={() => setShowClarification(false)}
        />
      )}
    </div>
  );
};
