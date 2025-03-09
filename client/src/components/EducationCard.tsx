import React from 'react';
import { EducationalContent } from '@shared/schema';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

interface EducationCardProps {
  content: EducationalContent;
}

const EducationCard: React.FC<EducationCardProps> = ({ content }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div 
        className="h-40 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${content.gradientFrom}, ${content.gradientTo})`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={`fas fa-${content.iconName} text-6xl text-white opacity-30`}></i>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{content.title}</h3>
        <p className="text-sm mb-4 text-primary opacity-70">{content.description}</p>
        
        <Link href={`/learn/${content.id}`}>
          <a className="inline-flex items-center text-primary hover:text-accent transition font-medium">
            Learn More <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default EducationCard;
