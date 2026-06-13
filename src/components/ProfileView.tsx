import React from 'react';
import { User, Calendar, CheckCircle } from 'lucide-react';
import { ParticipantProfile } from '../types/survey';

interface ProfileViewProps {
  profiles: ParticipantProfile[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profiles }) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (profiles.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Profiles Yet
          </h3>
          <p className="text-gray-500">
            Complete a survey recording to create your first profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Saved Profiles</h2>
        <p className="text-gray-600">
          {profiles.length} profile{profiles.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                <span className="font-semibold text-gray-900">
                  Profile #{profile.id.slice(-6)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {formatDate(profile.timestamp)}
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Completeness</span>
                <span className="text-sm text-gray-600">{profile.completeness}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${profile.completeness}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {Object.entries(profile.responses).map(([field, value]) => (
                <div key={field} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-600">{field}</div>
                    <div className="text-sm text-gray-900">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
