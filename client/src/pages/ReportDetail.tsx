import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Report } from '@shared/schema';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Eye, Star, ArrowLeft, Download } from 'lucide-react';
import { Link } from 'wouter';

const ReportDetail: React.FC = () => {
  const [, params] = useRoute('/reports/:id');
  const reportId = params?.id ? parseInt(params.id) : 0;
  
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch report details
  const { 
    data: report, 
    isLoading, 
    error 
  } = useQuery<Report>({
    queryKey: [`/api/reports/${reportId}`],
    enabled: reportId > 0,
  });
  
  const handleAddToCart = () => {
    if (report) {
      addItem(report);
      toast({
        title: "Added to cart",
        description: `${report.title} has been added to your cart.`,
      });
    }
  };
  
  // Helper for displaying stars
  const renderStars = (rating: number | null) => {
    const stars = [];
    
    if (rating === null) {
      // If rating is null, show 5 empty stars
      for (let i = 0; i < 5; i++) {
        stars.push(<Star key={`empty-${i}`} className="text-accent" />);
      }
      return stars;
    }
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="text-accent fill-accent" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="relative">
          <Star className="text-accent fill-accent" />
          <Star className="absolute top-0 right-0 text-accent fill-transparent" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        </span>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-accent" />);
    }
    
    return stars;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading report details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !report) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              We couldn't load the report details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again or select a different report.</p>
            <Button asChild className="mt-4">
              <Link href="/reports">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Reports
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/reports">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Reports
        </Link>
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Report Image */}
        <div>
          <div 
            className="w-full h-96 rounded-lg shadow-lg relative"
            style={{
              background: `linear-gradient(to right, ${report.gradientFrom}, ${report.gradientTo})`
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <i className={`fas fa-${report.iconName} text-9xl text-white opacity-20`}></i>
            </div>
            
            {report.isBestseller && (
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="bg-accent text-dark">Bestseller</Badge>
              </div>
            )}
          </div>
        </div>
        
        {/* Report Details */}
        <div>
          <h1 className="font-heading text-3xl font-bold mb-2">{report.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex">
              {renderStars(report.rating)}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              ({report.reviewCount || 0} reviews)
            </span>
          </div>
          
          <div className="text-2xl font-bold text-accent mb-6">
            ${report.price.toFixed(2)}
          </div>
          
          <p className="text-gray-700 mb-6">{report.description}</p>
          
          <div className="flex space-x-4 mb-8">
            {user?.isAdmin ? (
              <Button 
                size="lg" 
                variant="default"
                onClick={() => {
                  toast({
                    title: "Admin Access",
                    description: `You have full access to ${report.title} as an admin.`,
                  });
                }}
              >
                <Download className="mr-2 h-5 w-5" />
                Access Full Report
              </Button>
            ) : (
              <Button 
                size="lg"
                onClick={handleAddToCart}
                disabled={isInCart(report.id)}
              >
                {isInCart(report.id) ? 'In Cart' : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            )}
            
            {report.previewUrl && (
              <Button size="lg" variant="outline" asChild>
                <a href={report.previewUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-5 w-5" />
                  Preview Sample
                </a>
              </Button>
            )}
          </div>
          
          {/* Report Features */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  <span>Detailed 30+ page personalized report</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  <span>Accurate calculations based on your exact birth details</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  <span>Interpretation of all significant astrological factors</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  <span>Practical guidance for applying insights</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check text-accent mr-2"></i>
                  <span>PDF format for easy printing and saving</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Additional Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              After purchase, you'll receive your personalized report based on your birth details. 
              The report offers deep insights into your astrological blueprint, helping you 
              better understand yourself and navigate life's challenges with cosmic wisdom.
            </p>
            <p className="text-gray-700 mt-4">
              We recommend taking time to reflect on the insights provided, perhaps journaling 
              about how they resonate with your experiences and considering how you might 
              apply this wisdom to enhance your life journey.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>What You'll Need</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              For the most accurate report, please ensure you have the following information ready:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <i className="fas fa-calendar-alt text-accent mr-2"></i>
                <span>Your exact date of birth</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock text-accent mr-2"></i>
                <span>Your time of birth (as precise as possible)</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt text-accent mr-2"></i>
                <span>Your place of birth (city and country)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetail;
