'use client';

import React from 'react';
import ListingsGrid from '@/components/listings/ListingsGrid';
import { listingsData } from '@/data/listingsData';
import Sidebar from '@/components/layouts/Sidebar';

export default function Home() {
  return (
    <div className="flex container mx-auto flex-col md:flex-row min-h-screen">
      {/* سایدبار ثابت */}
      <div className="md:w-64 hidden md:block z-10">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>
      
      {/* بخش اصلی با اسکرول بدون اسکرول‌بار */}
      <div className="flex-grow h-[calc(100vh-10px)] overflow-y-auto scrollbar-hidden">
        <div className="px-4 py-6">
          {/* عنوان صفحه */}
          <h1 className="text-2xl font-bold mb-6 text-gray-100">آگهی‌های اخیر</h1>
          
          {/* نمایش گرید آگهی‌ها */}
          <ListingsGrid listings={listingsData} />
        </div>
      </div>
    </div>
  );
}

// استایل‌ها رو می‌تونی به فایل CSS یا Tailwind config اضافه کنی