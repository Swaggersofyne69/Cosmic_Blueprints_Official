import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { EducationalContent } from '@shared/schema';
import EducationCard from '@/components/EducationCard';
import ConstellationBackground from '@/components/ConstellationBackground';
import ZodiacWheel from '@/components/ZodiacWheel';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Book, Search, GraduationCap } from 'lucide-react';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'all', name: 'All Content' },
  { id: 'basics', name: 'Basics' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
];

const Learn: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContent, setSelectedContent] = useState<EducationalContent | null>(null);
  
  // Fetch educational content
  const { data: educationalContent, isLoading } = useQuery<EducationalContent[]>({
    queryKey: ['/api/educational-content'],
  });
  
  // Filter content based on search and category
  const filteredContent = educationalContent?.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          content.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || content.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle selecting a content item
  const handleContentSelect = (content: EducationalContent) => {
    setSelectedContent(content);
    window.scrollTo(0, 0);
  };
  
  // Handle back button
  const handleBack = () => {
    setSelectedContent(null);
  };
  
  // Render markdown content (simplified version)
  const renderMarkdown = (content: string) => {
    // Convert markdown headers
    content = content.replace(/# (.*)/g, '<h1 class="text-3xl font-heading font-bold mb-4 mt-6">$1</h1>');
    content = content.replace(/## (.*)/g, '<h2 class="text-2xl font-heading font-bold mb-3 mt-5">$1</h2>');
    content = content.replace(/### (.*)/g, '<h3 class="text-xl font-heading font-bold mb-2 mt-4">$1</h3>');
    
    // Convert markdown lists
    content = content.replace(/- (.*)/g, '<li class="ml-4 mb-2">$1</li>');
    content = content.replace(/<li/g, '<li class="flex items-start"><span class="mr-2 mt-1">•</span><span');
    content = content.replace(/<\/li>/g, '</span></li>');
    
    // Convert markdown emphasis
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert paragraphs (must be done last)
    content = content.replace(/^(?!<[hl]|<li)(.+)$/gm, '<p class="mb-4">$1</p>');
    
    return content;
  };
  
  if (selectedContent) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <Search className="mr-2 h-4 w-4" />
          Back to Learning Center
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader 
                className="pb-4"
                style={{
                  background: `linear-gradient(to right, ${selectedContent.gradientFrom}, ${selectedContent.gradientTo})`,
                  color: 'white'
                }}
              >
                <div className="flex items-center mb-2">
                  <i className={`fas fa-${selectedContent.iconName} text-2xl mr-2 opacity-80`}></i>
                  <CardTitle className="text-3xl">{selectedContent.title}</CardTitle>
                </div>
                <CardDescription className="text-white opacity-90">
                  {selectedContent.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div 
                  className="prose max-w-none" 
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedContent.content) }}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Related Content</CardTitle>
              </CardHeader>
              <CardContent>
                {!isLoading && educationalContent && (
                  <div className="space-y-4">
                    {educationalContent
                      .filter(content => content.id !== selectedContent.id)
                      .slice(0, 3)
                      .map(content => (
                        <div 
                          key={content.id} 
                          className="p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleContentSelect(content)}
                        >
                          <h3 className="font-heading font-bold mb-1">{content.title}</h3>
                          <p className="text-sm text-gray-600">{content.description}</p>
                        </div>
                      ))
                    }
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="mt-8 relative">
              <div className="aspect-square max-w-xs mx-auto">
                <ZodiacWheel rotate={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Hero Section */}
      <ConstellationBackground className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-white">
              Cosmic Wisdom <span className="text-accent">Learning Center</span>
            </h1>
            <p className="text-lg mb-8 opacity-90 text-white">
              Expand your astrological knowledge with our collection of educational resources
            </p>
          </div>
        </div>
      </ConstellationBackground>
      
      {/* Content Filter */}
      <div className="container mx-auto px-4 py-12">
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Explore Astrological Knowledge</CardTitle>
            <CardDescription>
              Search our educational content or browse by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search educational content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
              <TabsList className="w-full flex justify-start overflow-x-auto">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="h-40 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredContent && filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map(content => (
              <div key={content.id} onClick={() => handleContentSelect(content)} className="cursor-pointer">
                <EducationCard content={content} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Book className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="font-heading text-xl font-bold mb-2">No Content Found</h3>
            <p className="text-gray-600">
              We couldn't find any educational content matching your search criteria. 
              Please try adjusting your search or browse a different category.
            </p>
          </div>
        )}
        
        {/* Free Resources */}
        <div className="mt-16 bg-gray-100 p-8 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
              <h3 className="font-heading text-2xl font-bold mb-3">Your Astrological Journey</h3>
              <p className="mb-4 text-gray-600">
                From beginners to advanced practitioners, our learning center offers resources 
                for every stage of your astrological journey.
              </p>
              <Button className="inline-flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                Join Our Workshops
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
                  >
                    <i className="fas fa-play text-2xl"></i>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Learn;
