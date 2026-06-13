import React, { useState, useEffect } from 'react';
import { Survey } from '../types/survey';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { analyzeLiveTranscript, LiveAnalysisResult } from '../utils/liveTranscriptAnalysis';
import { Mic, Square, Loader2, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

interface LiveRecordingViewProps {
  survey: Survey;
  onComplete: (responses: Record<string, string>) => void;
}

export const LiveRecordingView: React.FC<LiveRecordingViewProps> = ({ survey, onComplete }) => {
  const {
    isListening,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    isSupported
  } = useSpeechRecognition();

  const [recordingTime, setRecordingTime] = useState(0);
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysisResult>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalyzedLength, setLastAnalyzedLength] = useState(0);

  // Timer
  useEffect(() => {
    let interval: number;
    if (isListening) {
      interval = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Auto-analyze transcript every 3 seconds when new content is added
  useEffect(() => {
    if (!isListening || transcript.length === lastAnalyzedLength) return;

    const analyzeTimer = setTimeout(async () => {
      if (transcript.length > lastAnalyzedLength + 50) { // Only analyze if significant new content
        setIsAnalyzing(true);
        try {
          const analysis = await analyzeLiveTranscript(transcript, survey);
          setLiveAnalysis(analysis);
          setLastAnalyzedLength(transcript.length);
        } catch (error) {
          console.error('Live analysis error:', error);
        } finally {
          setIsAnalyzing(false);
        }
      }
    }, 3000);

    return () => clearTimeout(analyzeTimer);
  }, [transcript, isListening, survey, lastAnalyzedLength]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setRecordingTime(0);
    setLiveAnalysis({});
    setLastAnalyzedLength(0);
    startListening();
  };

  const handleStop = async () => {
    stopListening();
    
    // Final analysis
    setIsAnalyzing(true);
    try {
      const finalAnalysis = await analyzeLiveTranscript(transcript, survey);
      setLiveAnalysis(finalAnalysis);
      
      // Extract responses
      const responses: Record<string, string> = {};
      Object.entries(finalAnalysis).forEach(([field, data]) => {
        if (data.value) {
          responses[field] = data.value;
        }
      });
      
      onComplete(responses);
    } catch (error) {
      console.error('Final analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <HelpCircle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'bg-green-50 border-green-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-red-50 border-red-200';
    }
  };

  if (!isSupported) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Speech Recognition Not Supported
          </h3>
          <p className="text-red-700">
            Your browser doesn't support live speech recognition. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Recording Controls */}
      <div className="bg-white rounded-lg p-8 border border-gray-200">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
            {isListening ? (
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
            {isListening && (
              <div className="flex items-center justify-center gap-2 text-red-600">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="font-medium">Live transcription active</span>
              </div>
            )}
          </div>

          <div className="flex gap-4 justify-center">
            {!isListening ? (
              <button
                onClick={handleStart}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
              >
                <Square className="w-5 h-5" />
                Stop & Analyze
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Transcript */}
      {(transcript || interimTranscript) && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
            {isAnalyzing && (
              <div className="flex items-center gap-2 text-blue-600 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
            <p className="text-gray-900 whitespace-pre-wrap">
              {transcript}
              {interimTranscript && (
                <span className="text-gray-400 italic">{interimTranscript}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Live Survey Population */}
      {Object.keys(liveAnalysis).length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Survey Fields (Auto-populated)
          </h3>
          <div className="space-y-3">
            {survey.questions.map(question => {
              const analysis = liveAnalysis[question.fieldName];
              
              return (
                <div
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    analysis ? getConfidenceColor(analysis.confidence) : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 mb-1">
                        {question.fieldName}
                      </div>
                      {analysis?.value ? (
                        <div className="text-sm text-gray-700">
                          {analysis.value}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 italic">
                          Not answered yet
                        </div>
                      )}
                    </div>
                    {analysis && getConfidenceIcon(analysis.confidence)}
                  </div>
                  {analysis?.needsClarification && (
                    <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 rounded px-2 py-1">
                      ⚠️ May need clarification
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
