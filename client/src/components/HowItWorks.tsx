import React from 'react';

const steps = [
  {
    icon: 'user-plus',
    title: 'Create Account',
    description: 'Sign up to access our full range of astrological reports and educational content.'
  },
  {
    icon: 'calendar-alt',
    title: 'Enter Birth Details',
    description: 'Provide your birth date, time, and location for accurate astrological calculations.'
  },
  {
    icon: 'file-alt',
    title: 'Choose Report',
    description: 'Select from our comprehensive range of personalized astrological reports.'
  },
  {
    icon: 'download',
    title: 'Receive Insights',
    description: 'Get your detailed report delivered instantly to your account dashboard.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="max-w-2xl mx-auto opacity-80">
            Four simple steps to unlock the cosmic wisdom in your astrological chart
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas fa-${step.icon} text-2xl text-dark`}></i>
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm opacity-80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
