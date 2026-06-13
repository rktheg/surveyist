import React, { useState } from 'react';
import { Users, Calendar, CheckCircle, ChevronRight } from 'lucide-react';
import { ParticipantProfile, Survey } from '../types/survey';

interface ProfilesViewProps {
  profiles: ParticipantProfile[];
  survey: Survey;
}

export const ProfilesView: React.FC<ProfilesViewProps> = ({ profiles, survey }) => {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCompletenessColor = (completeness: number) => {
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6 min-h-[500px]">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users size={20} />
          Participant Profiles
        </h2>
        <p className="text-sm text-gray-600">
          {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} collected
        </p>
      </div>

      {profiles.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 mb-2">No profiles yet</p>
          <p className="text-sm text-gray-500">
            Record your first survey to create a profile
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className="border border-gray-200 rounded-lg bg-white hover:shadow-soft transition-shadow cursor-pointer"
              onClick={() => setSelectedProfile(
                selectedProfile === profile.id ? null : profile.id
              )}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(profile.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {profile.responses['Participant Full Name'] || 'Unnamed Participant'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-sm font-semibold ${getCompletenessColor(profile.completeness)}`}>
                      {profile.completeness}%
                    </div>
                    <ChevronRight
                      size={20}
                      className={`text-gray-400 transition-transform ${
                        selectedProfile === profile.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {selectedProfile === profile.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {survey.questions.map((question) => {
                      const response = profile.responses[question.fieldName];
                      return (
                        <div key={question.id} className="space-y-1">
                          <div className="flex items-start gap-2">
                            {response ? (
                              <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {question.fieldName}
                              </p>
                              {response ? (
                                <p className="text-sm text-gray-700 mt-0.5">
                                  {response}
                                </p>
                              ) : (
                                <p className="text-sm text-gray-400 italic mt-0.5">
                                  Not answered
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
