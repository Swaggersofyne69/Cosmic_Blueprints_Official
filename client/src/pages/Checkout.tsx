import React, { useEffect, useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { apiRequest } from "@/lib/queryClient";
import { useCart } from '@/providers/CartProvider';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from "@/hooks/use-toast";
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, AlertCircle } from 'lucide-react';
import ConstellationBackground from '@/components/ConstellationBackground';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/account',
        },
      });

      if (error) {
        setErrorMessage(error.message);
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: "Thank you for your purchase!",
        });
        navigate('/account');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred');
      toast({
        title: "Payment Failed",
        description: err.message || 'An unexpected error occurred',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <div className="bg-destructive/10 p-4 rounded-md flex items-start mb-4">
          <AlertCircle className="text-destructive mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
          <span className="text-destructive">{errorMessage}</span>
        </div>
      )}
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
            Processing...
          </span>
        ) : (
          <span className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            Pay Now
          </span>
        )}
      </Button>
    </form>
  );
};

const Checkout: React.FC = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to complete your purchase",
        variant: "destructive",
      });
      navigate('/login?redirect=/checkout');
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive",
      });
      navigate('/reports');
      return;
    }
    
    // Create PaymentIntent as soon as the page loads
    const createPaymentIntent = async () => {
      try {
        const res = await apiRequest("POST", "/api/create-payment-intent", { amount: totalPrice });
        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast({
          title: "Payment Error",
          description: "There was a problem setting up the payment. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    createPaymentIntent();
  }, [user, items, totalPrice, navigate, toast]);

  const handleCompleteCheckout = async () => {
    try {
      await apiRequest("POST", "/api/checkout/complete", { 
        paymentIntentId: "pi_" + clientSecret.split("_secret_")[0] 
      });
      clearCart();
      toast({
        title: "Order Completed",
        description: "Your order has been successfully processed!",
      });
      navigate('/account');
    } catch (error) {
      console.error("Error completing checkout:", error);
      toast({
        title: "Checkout Error",
        description: "There was a problem completing your order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" asChild className="mb-6">
        <a href="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </a>
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Secure Checkout</CardTitle>
              <CardDescription>Complete your purchase securely</CardDescription>
            </CardHeader>
            <CardContent>
              {!clientSecret ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  <p className="mt-4 text-gray-600">Preparing your checkout...</p>
                </div>
              ) : (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm />
                </Elements>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.report.title}</span>
                    <span>${item.report.price.toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8">
            <ConstellationBackground className="rounded-lg p-6">
              <div className="text-white">
                <h3 className="font-heading text-xl font-bold mb-2">Your Cosmic Journey Awaits</h3>
                <p className="opacity-80 mb-4">
                  Your personalized astrological reports will be available for instant download in your account 
                  after payment is complete.
                </p>
                <div className="flex items-center">
                  <i className="fas fa-lock mr-2"></i>
                  <span>Secure Payment Processing</span>
                </div>
              </div>
            </ConstellationBackground>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
