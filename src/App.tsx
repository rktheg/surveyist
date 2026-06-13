import React, { useState } from 'react';
import { MobileFrame } from './components/MobileFrame';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { CoachingView } from './components/CoachingView';
import { RecordingView } from './components/RecordingView';
import { ProfilesView } from './components/ProfilesView';
import { Survey, ParticipantProfile } from './types/survey';

function App() {
  const [activeView, setActiveView] = useState('home');
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [profiles, setProfiles] = useState<ParticipantProfile[]>([]);

  const handleSurveyUpload = (survey: Survey) => {
    setCurrentSurvey(survey);
    setActiveView('coaching');
  };

  const handleSaveProfile = (responses: Record<string, string>) => {
    if (!currentSurvey) return;

    const completeness = Math.round(
      (Object.keys(responses).length / currentSurvey.questions.length) * 100
    );

    const newProfile: ParticipantProfile = {
      id: `profile-${Date.now()}`,
      surveyId: currentSurvey.id,
      timestamp: Date.now(),
      responses,
      completeness
    };

    setProfiles(prev => [newProfile, ...prev]);
    setActiveView('profiles');
  };

  return (
    <MobileFrame>
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      {activeView === 'home' && (
        <HomeView 
          onSurveyUpload={handleSurveyUpload}
          hasSurvey={!!currentSurvey}
        />
      )}
      
      {activeView === 'coaching' && currentSurvey && (
        <CoachingView survey={currentSurvey} />
      )}
      
      {activeView === 'record' && currentSurvey && (
        <RecordingView 
          survey={currentSurvey}
          onSaveProfile={handleSaveProfile}
        />
      )}
      
      {activeView === 'profiles' && (
        <ProfilesView 
          profiles={profiles}
          survey={currentSurvey}
        />
      )}
    </MobileFrame>
  );
}

export default App;
