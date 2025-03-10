import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ConstellationBackground } from '@/components/ConstellationBackground';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

export const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Get cart items
  const { data: cartItems, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await fetch('/api/cart');
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      return response.json();
    }
  });

  // Process free checkout
  const completeFreeCheckout = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: 'Reports Generated!',
        description: 'Your reports have been generated successfully.',
      });
      navigate('/account?tab=reports');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to generate reports: ${error.message}`,
        variant: 'destructive'
      });
    }
  });

  const handleGenerateReports = async () => {
    setIsGenerating(true);
    await completeFreeCheckout.mutateAsync();
    setIsGenerating(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="font-heading text-2xl font-bold mb-6">Loading...</h2>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="font-heading text-2xl font-bold mb-6">Your Cart is Empty</h2>
        <p className="mb-6">Add reports to your cart to generate your personalized astrological insights.</p>
        <Button onClick={() => navigate('/reports')}>Browse Reports</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="font-heading text-2xl font-bold mb-6">Generate Your Reports</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Your Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.report.title}</span>
                    <span>Free</span>
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Free</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full mt-6" 
            onClick={handleGenerateReports}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating Reports...' : 'Generate Reports'}
          </Button>
        </div>

        <div>
          <ConstellationBackground className="rounded-lg p-6">
            <div className="text-white">
              <h3 className="font-heading text-xl font-bold mb-2">Your Cosmic Journey Awaits</h3>
              <p className="opacity-80 mb-4">
                Your personalized astrological reports will be available for instant download in your account 
                after generation is complete.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <i className="fas fa-check mr-2"></i>
                  <span>Detailed 30+ page personalized report</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check mr-2"></i>
                  <span>Accurate calculations based on your exact birth details</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-check mr-2"></i>
                  <span>Interpretation of all significant astrological factors</span>
                </li>
              </ul>
            </div>
          </ConstellationBackground>
        </div>
      </div>
    </div>
  );
};

export default Checkout;