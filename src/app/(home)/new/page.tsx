'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/home/Header';
import CategorySearch from '@/components/home/CategorySearch';

export default function NewAdPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
  const router = useRouter();

  // Handle category selection
  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (categoryId: number, subcategoryId: number) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
    
    // For demo purposes, we'd navigate to the next step of ad creation
    // router.push(`/new/${categoryId}/${subcategoryId}`);
  };

  return (
    <div className="bg-gray-950 min-h-screen text-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 pt-28 pb-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-right">ثبت آگهی</h1>
          <h2 className="text-xl font-medium mb-8 text-right">پیشنهاد دسته آگهی</h2>
          
          <CategorySearch 
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            onCategoryChange={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
            }}
          />
        </div>
      </div>
    </div>
  );
}
