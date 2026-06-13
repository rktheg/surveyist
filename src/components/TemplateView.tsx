import React, { useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface TemplateViewProps {
  onTemplateProcess: (template: string) => void;
}

export const TemplateView: React.FC<TemplateViewProps> = ({ onTemplateProcess }) => {
  const [template, setTemplate] = useState('');

  const handleSubmit = () => {
    if (template.trim()) {
      onTemplateProcess(template);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Survey Template</h2>
        <p className="text-gray-600">
          Paste your survey questions below (one per line)
        </p>
      </div>

      <textarea
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        placeholder="Example:&#10;Full Name&#10;Age (18-25, 26-35, 36-45, 46+)&#10;Occupation&#10;Living Situation (Urban, Suburban, Rural)"
        className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={!template.trim()}
        className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <Upload size={20} />
        <span>Process Template</span>
      </button>
    </div>
  );
};
