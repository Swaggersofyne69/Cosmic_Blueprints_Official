import React from 'react';
import { Testimonial } from '@shared/schema';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  // Helper for displaying stars
  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<i key={i} className="fas fa-star text-accent"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-accent"></i>);
      }
    }
    
    return stars;
  };
  
  return (
    <div className="bg-primary bg-opacity-70 p-6 rounded-lg relative">
      <div className="text-accent text-5xl absolute top-4 right-4 opacity-20">
        <Quote />
      </div>
      
      <div className="mb-4">
        {renderStars(testimonial.rating)}
      </div>
      
      <p className="mb-6 italic opacity-90">{testimonial.testimonial}</p>
      
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-full mr-4" 
          style={{ backgroundColor: testimonial.avatarColor }}
        ></div>
        <div>
          <h4 className="font-heading font-bold">{testimonial.name}</h4>
          <p className="text-xs opacity-70">{testimonial.reportName}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
