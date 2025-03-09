import React from 'react';
import { Link } from 'wouter';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withLink = false }) => {
  const sizeClasses = {
    small: 'max-w-[120px]',
    medium: 'max-w-[200px]',
    large: 'max-w-[300px]',
  };

  const logoImage = (
    <div className="relative">
      <img 
        src="/images/cosmic-blueprints-logo.jpg" 
        alt="COSMIC BLUEPRINTS - Celestial Interpreter: Kyle Merritt" 
        className={`w-full h-auto rounded-full shadow-lg ${sizeClasses[size]} transition-transform hover:scale-105 duration-300`}
        style={{ border: '2px solid rgba(255, 215, 0, 0.7)' }} // Gold border
      />
      <div className="absolute inset-0 rounded-full pointer-events-none" 
           style={{ 
             boxShadow: 'inset 0 0 20px rgba(255, 255, 255, 0.3), 0 0 15px rgba(135, 206, 250, 0.5)',
             background: 'radial-gradient(circle at center, transparent 60%, rgba(30, 144, 255, 0.2) 100%)'
           }}>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="flex items-center justify-center cursor-pointer">
        {logoImage}
      </Link>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {logoImage}
    </div>
  );
};

export default Logo;
