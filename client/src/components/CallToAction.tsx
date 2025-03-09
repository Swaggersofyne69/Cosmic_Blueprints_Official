import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

interface CallToActionProps {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink
}) => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">{title}</h2>
          <p className="text-lg mb-8 opacity-90">{subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              size="lg"
              className="bg-accent hover:bg-opacity-90 text-dark font-medium"
              asChild
            >
              <Link href={primaryButtonLink}>{primaryButtonText}</Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="border border-white text-white hover:bg-white hover:bg-opacity-20"
              asChild
            >
              <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
