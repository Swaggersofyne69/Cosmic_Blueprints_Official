import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/providers/AuthProvider';
import { useCart } from '@/providers/CartProvider';
import Logo from './Logo';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogOut
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { items } = useCart();
  const { toast } = useToast();
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  return (
    <header className="bg-dark text-white">
      {/* Top Navigation */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
            className="text-accent hover:text-white transition">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
            className="text-accent hover:text-white transition">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
            className="text-accent hover:text-white transition">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
        <div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <User className="h-4 w-4 mr-1" />
                  {user.username}
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/account">My Account</Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <a className="text-sm text-white hover:text-accent transition mr-4">Login</a>
              </Link>
              <Link href="/signup">
                <a className="text-sm bg-accent hover:bg-opacity-90 text-dark transition px-4 py-2 rounded">Sign Up</a>
              </Link>
            </>
          )}
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Link href="/">
            <a className="flex items-center">
              <div className="w-16 h-16 mr-3 rounded-full overflow-hidden">
                <Logo />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white">
                COSMIC <span className="text-accent">BLUEPRINTS</span>
              </h1>
            </a>
          </Link>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        {/* Desktop navigation */}
        <div className={`md:flex flex-wrap justify-center md:justify-end space-y-2 md:space-y-0 space-x-1 md:space-x-6 ${isOpen ? 'flex flex-col' : 'hidden'}`}>
          <Link href="/">
            <a className={`px-2 py-1 hover:text-accent transition font-medium ${location === '/' ? 'text-accent' : 'text-white'}`}>
              Home
            </a>
          </Link>
          <Link href="/reports">
            <a className={`px-2 py-1 hover:text-accent transition font-medium ${location === '/reports' ? 'text-accent' : 'text-white'}`}>
              Reports
            </a>
          </Link>
          <Link href="/learn">
            <a className={`px-2 py-1 hover:text-accent transition font-medium ${location === '/learn' ? 'text-accent' : 'text-white'}`}>
              Learn
            </a>
          </Link>
          <Link href="/cart">
            <a className="pl-2 pr-1 py-1 text-accent hover:text-white transition relative">
              <ShoppingCart className="inline-block" />
              {items.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {items.length}
                </Badge>
              )}
            </a>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
