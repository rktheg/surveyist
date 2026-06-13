import React from 'react';
import { Zap, Mic, Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  profileCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, profileCount }) => {
  const quickStats = [
    { label: 'Total Profiles', value: profileCount, icon: Users, color: 'bg-blue-500' },
    { label: 'Avg Completion', value: '87%', icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Practice Sessions', value: '12', icon: Clock, color: 'bg-purple-500' },
    { label: 'Surveys Analyzed', value: '8', icon: CheckCircle, color: 'bg-orange-500' }
  ];

  const actionCards = [
    {
      id: 'coaching',
      title: 'AI Coaching',
      description: 'Get AI-powered training on survey questions',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('coaching')
    },
    {
      id: 'record',
      title: 'Record Session',
      description: 'Capture and analyze survey responses',
      icon: Mic,
      color: 'from-green-500 to-green-600',
      action: () => onNavigate('record')
    },
    {
      id: 'profiles',
      title: 'View Profiles',
      description: 'Review saved participant profiles',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('profiles')
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Surveyist
        </h1>
        <p className="text-gray-600">
          Your AI-powered survey coaching and analysis platform
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-soft border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stat.value}
              </span>
            </div>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Quick Actions
        </h2>
        {actionCards.map((card) => (
          <button
            key={card.id}
            onClick={card.action}
            className={`w-full bg-gradient-to-r ${card.color} text-white rounded-lg p-4 shadow-soft hover:shadow-lg transition-all active:scale-95`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <card.icon size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-sm text-white/90">{card.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-soft border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Completed practice session</span>
            <span className="text-gray-400 ml-auto">2h ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Saved new profile</span>
            <span className="text-gray-400 ml-auto">5h ago</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Analyzed recording</span>
            <span className="text-gray-400 ml-auto">1d ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};
