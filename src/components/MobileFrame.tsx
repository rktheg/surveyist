import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '844px' }}>
        {children}
      </div>
    </div>
  );
};
