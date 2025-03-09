import React, { useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import ConstellationBackground from '@/components/ConstellationBackground';
import ZodiacWheel from '@/components/ZodiacWheel';
import ReportCard from '@/components/ReportCard';
import TestimonialCard from '@/components/TestimonialCard';
import EducationCard from '@/components/EducationCard';
import CallToAction from '@/components/CallToAction';
import HowItWorks from '@/components/HowItWorks';
import { Button } from '@/components/ui/button';
import { ChevronRight, GraduationCap } from 'lucide-react';
import { Report, Testimonial, EducationalContent } from '@shared/schema';

const Home: React.FC = () => {
  // Fetch reports
  const { data: reports, isLoading: reportsLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });
  
  // Fetch testimonials
  const { data: testimonials, isLoading: testimonialsLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });
  
  // Fetch educational content
  const { data: educationalContent, isLoading: educationalContentLoading } = useQuery<EducationalContent[]>({
    queryKey: ['/api/educational-content'],
  });
  
  return (
    <>
      {/* Hero Section */}
      <ConstellationBackground className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
                Discover Your <span className="text-accent">Cosmic Blueprint</span>
              </h2>
              <p className="text-lg mb-4 opacity-90 text-white">
                Unlock the mysteries of your astrological chart with our in-depth reports. 
                Navigate life's journey with the wisdom of the stars as your guide.
              </p>
              <blockquote className="border-l-4 border-accent pl-4 my-6 italic text-white opacity-85">
                "Guided by the language of the stars, our Celestial Interpreter weaves together the cosmic threads that shape your journey, revealing the hidden wisdom within your birth chart."
              </blockquote>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  className="bg-accent hover:bg-opacity-90 text-dark font-medium"
                  asChild
                >
                  <Link href="/reports">Explore Reports</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-accent text-accent hover:bg-accent hover:bg-opacity-20"
                  asChild
                >
                  <Link href="/learn">Learn Astrology</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <div className="absolute inset-0 rounded-full">
                  <ZodiacWheel size={384} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ConstellationBackground>
      
      {/* Featured Reports Section */}
      <section id="reports" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Astrological Reports</h2>
            <p className="max-w-2xl mx-auto text-primary opacity-80">
              Each report is crafted with precision and insight, offering you a deeper understanding 
              of your astrological blueprint.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reportsLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between mb-4">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      <div className="h-10 w-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual reports
              reports?.slice(0, 3).map(report => (
                <ReportCard key={report.id} report={report} />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="inline-flex items-center"
              asChild
            >
              <Link href="/reports">
                View All Reports <ChevronRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Education Section */}
      <section id="education" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Learn Astrology</h2>
            <p className="max-w-2xl mx-auto text-primary opacity-80">
              Deepen your understanding of astrological concepts with our educational resources.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationalContentLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : (
              // Actual educational content
              educationalContent?.slice(0, 3).map(content => (
                <EducationCard key={content.id} content={content} />
              ))
            )}
          </div>
          
          <div className="bg-gray-100 mt-12 p-8 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h3 className="font-heading text-2xl font-bold mb-3">Free Astrology Learning Center</h3>
                <p className="mb-4 text-primary opacity-80">
                  Access our comprehensive library of articles, videos, and interactive tools 
                  to enhance your astrological knowledge.
                </p>
                <Button
                  className="inline-flex items-center"
                  asChild
                >
                  <Link href="/learn">
                    Explore Resources <GraduationCap className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="md:w-1/2">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Astrology Learning" 
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute inset-0 bg-dark bg-opacity-30 flex items-center justify-center">
                    <Button
                      size="icon"
                      className="w-16 h-16 rounded-full bg-accent text-dark hover:bg-opacity-90"
                      asChild
                    >
                      <Link href="/learn">
                        <i className="fas fa-play text-2xl"></i>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <ConstellationBackground className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
              Client Testimonials
            </h2>
            <p className="max-w-2xl mx-auto text-white opacity-80">
              Hear what our clients have to say about their cosmic journey with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-primary bg-opacity-50 p-6 rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 w-32 rounded mb-4 opacity-40"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 opacity-40"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 opacity-40"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 opacity-40"></div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mr-4 opacity-40"></div>
                    <div>
                      <div className="h-4 w-24 bg-gray-200 rounded mb-1 opacity-40"></div>
                      <div className="h-3 w-16 bg-gray-200 rounded opacity-40"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Actual testimonials
              testimonials?.map(testimonial => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))
            )}
          </div>
        </div>
      </ConstellationBackground>
      
      {/* Call to Action */}
      <CallToAction 
        title="Begin Your Cosmic Journey Today"
        subtitle="Discover the celestial wisdom that has been waiting for you since the moment of your birth."
        primaryButtonText="Explore Reports"
        primaryButtonLink="/reports"
        secondaryButtonText="Create Account"
        secondaryButtonLink="/signup"
      />
    </>
  );
};

export default Home;
