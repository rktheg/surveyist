import React, { useState } from 'react';
import { FileText, Mic, User, BookOpen } from 'lucide-react';
import { TemplateView } from './components/TemplateView';
import { CoachingView } from './components/CoachingView';
import { PracticeView } from './components/PracticeView';
import { LiveRecordingView } from './components/LiveRecordingView';
import { ProfileView } from './components/ProfileView';
import { ParsedQuestionsView } from './components/ParsedQuestionsView';
import { Survey, ParticipantProfile } from './types/survey';
import { parseSurveyTemplate } from './utils/surveyParser';

type View = 'template' | 'parsed' | 'coaching' | 'practice' | 'recording' | 'profile';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('template');
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [profiles, setProfiles] = useState<ParticipantProfile[]>([]);

  const handleTemplateProcess = async (template: string) => {
    try {
      const questions = await parseSurveyTemplate(template);
      
      const survey: Survey = {
        id: `survey-${Date.now()}`,
        name: 'Participant Survey',
        questions
      };

      setCurrentSurvey(survey);
      setCurrentView('parsed');
    } catch (error) {
      console.error('Error processing template:', error);
      alert('Failed to process survey template. Please check the format and try again.');
    }
  };

  const handleQuestionsConfirmed = (survey: Survey) => {
    setCurrentSurvey(survey);
    setCurrentView('coaching');
  };

  const handleRecordingComplete = (responses: Record<string, string>) => {
    if (!currentSurvey) return;

    const profile: ParticipantProfile = {
      id: `profile-${Date.now()}`,
      surveyId: currentSurvey.id,
      timestamp: Date.now(),
      responses,
      completeness: Math.round(
        (Object.keys(responses).length / currentSurvey.questions.length) * 100
      )
    };

    setProfiles(prev => [...prev, profile]);
    alert('Profile saved successfully!');
  };

  const renderView = () => {
    switch (currentView) {
      case 'template':
        return <TemplateView onTemplateProcess={handleTemplateProcess} />;
      case 'parsed':
        return currentSurvey ? (
          <ParsedQuestionsView 
            survey={currentSurvey}
            onConfirm={handleQuestionsConfirmed}
            onBack={() => setCurrentView('template')}
          />
        ) : null;
      case 'coaching':
        return currentSurvey ? (
          <CoachingView survey={currentSurvey} />
        ) : null;
      case 'practice':
        return currentSurvey ? (
          <PracticeView survey={currentSurvey} />
        ) : null;
      case 'recording':
        return currentSurvey ? (
          <LiveRecordingView 
            survey={currentSurvey}
            onComplete={handleRecordingComplete}
          />
        ) : null;
      case 'profile':
        return <ProfileView profiles={profiles} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-xl font-bold">Surveyist</h1>
          <p className="text-sm text-blue-100">AI-Powered Survey Companion</p>
        </div>

        <div className="pb-20">
          {renderView()}
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200">
          <div className="flex justify-around p-2">
            <button
              onClick={() => setCurrentView('template')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === 'template' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'
              }`}
            >
              <FileText size={24} />
              <span className="text-xs mt-1">Template</span>
            </button>

            <button
              onClick={() => currentSurvey && setCurrentView('coaching')}
              disabled={!currentSurvey}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === 'coaching' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'
              } ${!currentSurvey ? 'opacity-50' : ''}`}
            >
              <BookOpen size={24} />
              <span className="text-xs mt-1">Coaching</span>
            </button>

            <button
              onClick={() => currentSurvey && setCurrentView('recording')}
              disabled={!currentSurvey}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === 'recording' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'
              } ${!currentSurvey ? 'opacity-50' : ''}`}
            >
              <Mic size={24} />
              <span className="text-xs mt-1">Record</span>
            </button>

            <button
              onClick={() => setCurrentView('profile')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === 'profile' ? 'text-blue-500 bg-blue-50' : 'text-gray-600'
              }`}
            >
              <User size={24} />
              <span className="text-xs mt-1">Profiles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
