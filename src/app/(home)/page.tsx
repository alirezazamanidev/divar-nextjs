
import React from 'react';
import Sidebar from '@/components/layouts/Sidebar';
import { getCategories } from '@/libs/services/category.service';
import { GetPosts } from '@/libs/services/post.service';
import PostsGrid from '@/components/post/postsGrid';

export default async function Home({searchParams}:{searchParams:Promise<{category?:string,price?:string}>}) {
  const {category,price}=await searchParams
  const categorydata=await getCategories({slug:category || ''})
  const postPaginstion=await GetPosts({priceRange:price||'',categorySlug:category});
  return (
    <div className="flex container mx-auto flex-col md:flex-row min-h-screen">
      {/* سایدبار ثابت */}
      <div className="md:w-64 hidden md:block z-10">
        <Sidebar categoriesData={categorydata} />
      </div>
      
      {/* بخش اصلی با اسکرول بدون اسکرول‌بار */}
      <div className="flex-grow h-[calc(100vh-10px)] overflow-y-auto scrollbar-hidden">
        <div className="px-4 py-6">
          {/* عنوان صفحه */}
          <h1 className="text-2xl font-bold mb-6 text-gray-100">آگهی‌های اخیر</h1>
          
          {/* نمایش گرید آگهی‌ها */}
          <PostsGrid postPaginstion={postPaginstion}/>
        </div>
      </div>
    </div>
  );
}

// استایل‌ها رو می‌تونی به فایل CSS یا Tailwind config اضافه کنی