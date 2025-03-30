'use client';

import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, ChevronLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Category, Category as CategoryModel } from '@/libs/models/category';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import getCreatePostForm, { CreatePostDataForm } from '@/libs/services/post.service';

interface CategorySearchProps {
  createPostData:CreatePostDataForm
}


export default function CategorySearch({createPostData}: CategorySearchProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>(createPostData.categories ?? []);
  const searchParams = useSearchParams();
  let slug = searchParams.get('slug');
  
  useEffect(() => {
    if (slug !== null) {
      updateCreatePostData();
    }
  }, [slug]);
  
  const updateCreatePostData = async() => {
    const response = await getCreatePostForm({slug:slug||''});
    if (response) {
      setCategories(response.categories || []);
    }
  }
  // Render breadcrumb navigation
  const renderBreadcrumb = () => {
    if (!createPostData.showBack) {
      return null;
    }
    
    return (
      <div dir="rtl" className="flex flex-wrap items-center gap-2 mb-4 text-gray-400 text-sm">
        {createPostData.showBack && (
          <>
            <button 
              onClick={() => router.back()}
              className="flex items-center text-blue-500 hover:text-blue-400 transition-colors"
            >
              <ChevronLeftIcon className="h-4 w-4 ml-1" />
              بازگشت به دسته‌های قبلی
            </button>
            
            {createPostData.category && (
              <div className="flex items-center gap-1">
                <span>{createPostData.category.title}</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Breadcrumb navigation */}
      {renderBreadcrumb()}
      
      {/* Search input
      <div className="relative mb-6">
        <input
          type="text"
          className="w-full py-3 px-10 bg-gray-800 text-gray-100 placeholder-gray-500 border border-gray-700 rounded-lg text-right"
          placeholder="جستجو در دسته‌بندی‌ها..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          dir="rtl"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-3"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>
       */}
      {/* Main categories */}
     
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category:Category) => (
            <Link
            href={`/new?slug=${category.slug}`}
              key={category.id}
              
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-2 h-full"
            >
              {/* <div className="text-2xl mb-2">{category.icon}</div> */}
              <div className="text-sm font-medium text-center">{category.title}</div>
            </Link>
          ))}
        </div>
      
      
      
      
     
           
    </div>
  );
} 