import React from 'react';

const Logo: React.FC = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="250" cy="250" r="240" fill="#1a3a5f" />
      
      {/* Blue zodiac circle */}
      <circle cx="250" cy="250" r="220" fill="#3a7ca5" />
      
      {/* Zodiac grid lines */}
      {Array.from({ length: 24 }).map((_, i) => (
        <line 
          key={`line-${i}`}
          x1="250" 
          y1="30" 
          x2="250" 
          y2="470"
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="1" 
          transform={`rotate(${i * 15} 250 250)`} 
        />
      ))}
      
      {/* Circular zones */}
      <circle cx="250" cy="250" r="180" fill="#1a3a5f" strokeWidth="2" stroke="white" opacity="0.5" />
      <circle cx="250" cy="250" r="140" fill="#3a7ca5" strokeWidth="2" stroke="white" opacity="0.3" />
      <circle cx="250" cy="250" r="100" fill="#0a1f33" strokeWidth="2" stroke="white" opacity="0.2" />
      
      {/* Red zodiac segments */}
      <path 
        d="M250 70 A180 180 0 0 1 396 180 L250 250 Z" 
        fill="#c03546" 
        opacity="0.8" 
      />
      <path 
        d="M396 180 A180 180 0 0 1 396 320 L250 250 Z" 
        fill="#c03546" 
        opacity="0.7" 
      />
      
      {/* Gold accents */}
      <circle cx="250" cy="250" r="30" fill="#d4af37" opacity="0.8" />
      <circle cx="250" cy="250" r="15" fill="white" opacity="0.9" />
      <circle cx="250" cy="250" r="8" fill="black" />
      
      {/* Stars */}
      <circle cx="340" cy="100" r="4" fill="white" />
      <circle cx="380" cy="200" r="3" fill="white" />
      <circle cx="160" cy="120" r="3" fill="white" />
      <circle cx="240" cy="80" r="2" fill="white" />
      <circle cx="300" cy="400" r="3" fill="white" />
      <circle cx="120" cy="320" r="2" fill="white" />
      
      {/* Center glowing star */}
      <circle cx="250" cy="250" r="60" fill="url(#starGlow)" />
      
      {/* Logo text banner */}
      <rect x="90" y="430" width="320" height="40" fill="white" />
      <text 
        x="250" 
        y="460" 
        fontFamily="'Montserrat', sans-serif" 
        fontSize="22" 
        fontWeight="700" 
        textAnchor="middle" 
        fill="#1a3a5f"
      >
        COSMIC BLUEPRINTS
      </text>
      
      {/* Gradient definitions */}
      <defs>
        <radialGradient id="starGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#3a7ca5" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1a3a5f" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Logo;
