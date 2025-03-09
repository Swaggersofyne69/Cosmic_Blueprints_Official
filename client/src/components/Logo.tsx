import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <img 
        src="/cosmic-blueprints-logo.jpg" 
        alt="COSMIC BLUEPRINTS - Celestial Interpreter: Kyle Merritt" 
        className="w-full max-w-[300px] h-auto"
      />
    </div>
  );
};

export default Logo;
