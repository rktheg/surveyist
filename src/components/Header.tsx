import React from 'react';
import { Home, BookOpen, Mic, Users } from 'lucide-react';

interface HeaderProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'coaching', icon: BookOpen, label: 'Coach' },
    { id: 'record', icon: Mic, label: 'Record' },
    { id: 'profiles', icon: Users, label: 'Profiles' },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-around py-3">
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewChange(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeView === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
