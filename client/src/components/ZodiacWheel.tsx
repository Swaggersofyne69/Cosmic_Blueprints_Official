import React from 'react';

interface ZodiacWheelProps {
  className?: string;
  size?: number;
  rotate?: boolean;
}

const ZodiacWheel: React.FC<ZodiacWheelProps> = ({ 
  className = '', 
  size = 300,
  rotate = true
}) => {
  return (
    <div 
      className={`relative ${rotate ? 'animate-spin-slow' : ''} ${className}`}
      style={{ 
        width: size, 
        height: size, 
        animationDuration: '90s', 
        animationTimingFunction: 'linear', 
        animationIterationCount: 'infinite'
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="250" cy="250" r="240" stroke="#d4af37" strokeWidth="2" fill="none" />
        
        {/* Blue zodiac background */}
        <circle cx="250" cy="250" r="220" fill="#1a3a5f" />
        
        {/* Zodiac grid lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`zodiac-section-${i}`}>
            <line 
              x1="250" 
              y1="30" 
              x2="250" 
              y2="470"
              stroke="rgba(255,255,255,0.3)" 
              strokeWidth="1" 
              transform={`rotate(${i * 30} 250 250)`} 
            />
            
            {/* Zodiac symbols - positioned at each 30 degree mark */}
            <text 
              x="250" 
              y="50" 
              fill="white" 
              fontSize="18" 
              textAnchor="middle" 
              transform={`rotate(${i * 30} 250 250) rotate(${-i * 30} 250 50)`}
            >
              {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"][i]}
            </text>
          </g>
        ))}
        
        {/* Circular zones */}
        <circle cx="250" cy="250" r="180" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="250" cy="250" r="120" stroke="white" strokeWidth="1" fill="none" opacity="0.3" />
        
        {/* Center parts */}
        <circle cx="250" cy="250" r="60" fill="#3a7ca5" opacity="0.7" />
        <circle cx="250" cy="250" r="30" fill="#0a1f33" />
        
        {/* Stars */}
        {Array.from({ length: 18 }).map((_, i) => {
          const angle = i * 20;
          const radius = 170 + (i % 3) * 20;
          const x = 250 + radius * Math.cos(angle * Math.PI / 180);
          const y = 250 + radius * Math.sin(angle * Math.PI / 180);
          const size = 1 + Math.random() * 2;
          
          return (
            <circle 
              key={`star-${i}`}
              cx={x} 
              cy={y} 
              r={size} 
              fill="white" 
              opacity={0.5 + Math.random() * 0.5}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ZodiacWheel;
