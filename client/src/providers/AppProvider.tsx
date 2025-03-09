import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { Toaster } from '@/components/ui/toaster';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
};