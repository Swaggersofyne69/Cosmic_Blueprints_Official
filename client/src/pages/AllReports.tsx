import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReportCard from '@/components/ReportCard';
import { Report } from '@shared/schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All Reports' },
  { id: 'Personal', name: 'Personal' },
  { id: 'Relationship', name: 'Relationship' },
  { id: 'Career', name: 'Career' },
  { id: 'Forecast', name: 'Forecast' },
  { id: 'Spiritual', name: 'Spiritual' },
];

const AllReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Fetch all reports
  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['/api/reports'],
  });
  
  // Filter reports based on search and category
  const filteredReports = reports?.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || report.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="font-heading text-4xl font-bold mb-4">Astrological Reports</h1>
        <p className="text-lg text-gray-600">
          Discover our comprehensive range of personalized astrological reports, 
          crafted to illuminate different aspects of your cosmic journey.
        </p>
      </div>
      
      {/* Search and Filter */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Find Your Perfect Report</CardTitle>
          <CardDescription>
            Browse our complete collection or filter by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search reports..."
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
      
      {/* Reports Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
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
          ))}
        </div>
      ) : filteredReports && filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="font-heading text-xl font-bold mb-2">No Reports Found</h3>
          <p className="text-gray-600">
            We couldn't find any reports matching your search criteria. Please try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default AllReports;
