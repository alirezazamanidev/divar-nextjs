import React from 'react';
import Header from '@/components/layouts/Header';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      <Header />
      
      {children}
    </div>
  );
} 