import React, { createContext, useContext, useState, useEffect } from 'react';
import { Report } from '@shared/schema';
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from './AuthProvider';

interface CartItem {
  id: number;
  report: Report;
}

interface CartContextProps {
  items: CartItem[];
  addItem: (report: Report) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  isInCart: (reportId: number) => boolean;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  const totalPrice = items.reduce((total, item) => total + item.report.price, 0);
  
  // Fetch cart items when user logs in
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);
  
  const fetchCartItems = async () => {
    try {
      const response = await fetch('/api/cart', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const cartItems: CartItem[] = await response.json();
        setItems(cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  const addItem = async (report: Report) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to add items to your cart",
          variant: "destructive"
        });
        return;
      }
      
      const response = await apiRequest('POST', '/api/cart', { reportId: report.id });
      
      if (response.ok) {
        const newItem = await response.json();
        setItems(prev => [...prev, newItem]);
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: "Error",
        description: "Could not add item to cart",
        variant: "destructive"
      });
    }
  };
  
  const removeItem = async (id: number) => {
    try {
      const response = await apiRequest('DELETE', `/api/cart/${id}`, undefined);
      
      if (response.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        title: "Error",
        description: "Could not remove item from cart",
        variant: "destructive"
      });
    }
  };
  
  const clearCart = async () => {
    try {
      const response = await apiRequest('DELETE', '/api/cart', undefined);
      
      if (response.ok) {
        setItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Could not clear cart",
        variant: "destructive"
      });
    }
  };
  
  const isInCart = (reportId: number) => {
    return items.some(item => item.report.id === reportId);
  };
  
  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      clearCart, 
      isInCart, 
      totalPrice 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
