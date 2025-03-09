import React from 'react';
import { Link } from 'wouter';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withLink = false }) => {
  const sizeClasses = {
    small: 'max-w-[150px]',
    medium: 'max-w-[250px]',
    large: 'max-w-[350px]',
  };

  const logoImage = (
    <img 
      src="/images/cosmic-blueprints-logo.jpg" 
      alt="COSMIC BLUEPRINTS - Celestial Interpreter: Kyle Merritt" 
      className={`w-full h-auto rounded-full ${sizeClasses[size]}`}
    />
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
