import React from 'react';
import StarField from './StarField';

interface ConstellationBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const ConstellationBackground: React.FC<ConstellationBackgroundProps> = ({ 
  children, 
  className = ''
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background color */}
      <div className="absolute inset-0 bg-primary bg-opacity-95"></div>
      
      {/* Stars */}
      <StarField />
      
      {/* Constellation pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ConstellationBackground;
