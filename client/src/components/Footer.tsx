import React from 'react';
import { Link } from 'wouter';
import Logo from './Logo';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 mr-3 rounded-full overflow-hidden">
                <Logo />
              </div>
              <h3 className="font-heading text-xl font-bold">
                COSMIC <span className="text-accent">BLUEPRINTS</span>
              </h3>
            </div>
            <p className="text-sm opacity-70 mb-6">
              Illuminating your path through the wisdom of the stars. Personalized astrological reports and education to guide your cosmic journey.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-accent hover:text-white transition">
                <Facebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-accent hover:text-white transition">
                <Instagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-accent hover:text-white transition">
                <Twitter />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                className="text-accent hover:text-white transition">
                <Youtube />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Reports</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition">
                  Birth Chart Analysis
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition">
                  Relationship Compatibility
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition">
                  Career & Purpose
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition">
                  Solar Return
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition">
                  Transit Forecast
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-gray-300 hover:text-white transition">
                  View All Reports
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Learn</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/learn" className="text-sm text-gray-300 hover:text-white transition">
                  Zodiac Signs
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-sm text-gray-300 hover:text-white transition">
                  Planets & Houses
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-sm text-gray-300 hover:text-white transition">
                  Aspects & Transits
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-sm text-gray-300 hover:text-white transition">
                  Astrology Basics
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-sm text-gray-300 hover:text-white transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/learn" className="text-sm text-gray-300 hover:text-white transition">
                  Astrology Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                  Our Astrologers
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="text-sm text-gray-300 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary pt-8 text-center">
          <p className="text-sm text-gray-300">&copy; {new Date().getFullYear()} Cosmic Blueprints. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
