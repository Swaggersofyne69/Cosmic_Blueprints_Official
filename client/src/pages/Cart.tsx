import React from 'react';
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, CreditCard, ArrowLeft, ShoppingBag, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import ConstellationBackground from '@/components/ConstellationBackground';
import { Link } from 'wouter';

const Cart: React.FC = () => {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const handleRemoveItem = (id: number) => {
    removeItem(id);
    toast({
      title: "Item Removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to proceed to checkout",
        variant: "destructive",
      });
      navigate('/login?redirect=/checkout');
      return;
    }
    
    navigate('/checkout');
  };
  
  return (
    <>
      {/* Cart Header */}
      <ConstellationBackground className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-3xl font-bold text-white text-center">
            Your Cosmic Cart
          </h1>
        </div>
      </ConstellationBackground>
      
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/reports">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        
        {items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="font-heading text-2xl font-bold mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Looks like you haven't added any astrological reports to your cart yet. 
                Explore our reports to find insights that resonate with you.
              </p>
              <Button asChild>
                <Link href="/reports">Browse Reports</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {items.map(item => (
                      <div key={item.id} className="flex flex-col md:flex-row gap-4 pb-6 border-b">
                        <div 
                          className="w-full md:w-24 h-24 rounded-lg flex-shrink-0"
                          style={{
                            background: `linear-gradient(to right, ${item.report.gradientFrom}, ${item.report.gradientTo})`
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <i className={`fas fa-${item.report.iconName} text-3xl text-white opacity-60`}></i>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="font-heading text-lg font-medium mb-1">
                            {item.report.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.report.description.substring(0, 100)}...
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-accent">
                              ${item.report.price.toFixed(2)}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleClearCart}>
                    Clear Cart
                  </Button>
                  <Button asChild>
                    <Link href="/reports">Add More Reports</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      onClick={handleCheckout}
                    >
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Button>
                    
                    {!user && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          You'll need to sign in before checkout
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-heading text-sm font-bold mb-2">Secure Checkout</h3>
                <p className="text-xs text-gray-600">
                  Your payment information is processed securely. We do not store credit card details.
                </p>
                <div className="flex items-center mt-3 space-x-3">
                  <i className="fab fa-cc-visa text-2xl text-blue-800"></i>
                  <i className="fab fa-cc-mastercard text-2xl text-red-600"></i>
                  <i className="fab fa-cc-amex text-2xl text-blue-500"></i>
                  <i className="fab fa-cc-discover text-2xl text-orange-500"></i>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
