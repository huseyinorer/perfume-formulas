import React from 'react';
import Footer from './Footer.jsx';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[1800px] mx-auto p-4 dark:bg-gray-900">
        {children}
      </div>
      <Footer />
    </div>
  );
};
