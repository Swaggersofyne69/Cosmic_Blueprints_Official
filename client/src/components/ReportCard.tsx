import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { Report } from '@shared/schema';
import { Link } from 'wouter';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/providers/CartProvider';

interface ReportCardProps {
  report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(report);
    toast({
      title: "Added to cart",
      description: `${report.title} has been added to your cart.`,
    });
  };

  // Helper for displaying stars
  const renderStars = (rating: number | null) => {
    if (rating === null) return [];

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fas fa-star text-accent"></i>);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fas fa-star-half-alt text-accent"></i>);
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-accent"></i>);
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div 
        className="h-48 relative overflow-hidden"
        style={{
          background: `linear-gradient(to right, ${report.gradientFrom}, ${report.gradientTo})`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <i className={`fas fa-${report.iconName} text-6xl text-white opacity-30`}></i>
        </div>

        {report.isBestseller && (
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-dark to-transparent">
            <Badge variant="secondary" className="bg-accent text-dark">Bestseller</Badge>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-heading text-xl font-bold mb-2">{report.title}</h3>
        <p className="text-sm mb-4 text-primary opacity-70">{report.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="font-medium">Free</div>

          <div className="flex items-center">
            {renderStars(report.rating)}
            <span className="text-xs ml-1 text-primary opacity-70">({report.reviewCount})</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            className="flex-1"
            onClick={handleAddToCart}
            disabled={isInCart(report.id)}
          >
            {isInCart(report.id) ? 'In Cart' : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>

          <Link href={`/reports/${report.id}`}>
            <Button variant="outline">
              <Eye className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;