import React from 'react';
import { Link } from 'wouter';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'max-w-[150px]',
    medium: 'max-w-[250px]',
    large: 'max-w-[350px]',
  };

  return (
    <Link href="/">
      <a className="flex items-center justify-center cursor-pointer">
        <img 
          src="/images/cosmic-blueprints-logo.jpg" 
          alt="COSMIC BLUEPRINTS - Celestial Interpreter: Kyle Merritt" 
          className={`w-full h-auto rounded-full ${sizeClasses[size]}`}
        />
      </a>
    </Link>
  );
};

export default Logo;
