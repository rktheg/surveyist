import React, { useState } from 'react';
import { Upload, Zap } from 'lucide-react';

interface TemplateViewProps {
  onTemplateProcess: (template: string) => void;
}

export const TemplateView: React.FC<TemplateViewProps> = ({ onTemplateProcess }) => {
  const [template, setTemplate] = useState('');

  const handleProcess = () => {
    if (template.trim()) {
      onTemplateProcess(template);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">
          Survey Template
        </h2>
        <p className="text-sm text-gray-600">
          Upload or paste your survey template
        </p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
          <Upload className="mx-auto mb-3 text-gray-400" size={40} />
          <p className="text-gray-700 font-medium">
            Drag & drop file
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or click to browse
          </p>
        </div>

        <div className="relative">
          <div className="text-center text-gray-400 text-sm mb-3">
            or paste template
          </div>
        </div>

        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Paste your survey template here..."
          className="w-full h-48 p-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />

        <button
          onClick={handleProcess}
          disabled={!template.trim()}
          className="w-full p-4 bg-blue-500 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <Zap size={20} />
          <span>Process Template</span>
        </button>
      </div>
    </div>
  );
};
