
import { ChevronLeft } from 'lucide-react';

import { GetSinglePostBySlug } from '@/libs/services/post.service';
import { notFound } from 'next/navigation';
import { SinglePostLayout } from '@/components/post/singlePostLayout';

export default async function SinglePostPage({params}:{params:Promise<{slug:string}>}) {
 
    const {slug}=await params
    const post=await GetSinglePostBySlug(slug);
    if(!post) notFound()
  return (
    <div className="  container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6 justify-end gap-2">
        <span>املاک</span>
        <ChevronLeft size={16} />
        <span>فروش مسکونی</span>
        <ChevronLeft size={16} />
        <span>فروش خانه و ویلا</span>
        <ChevronLeft size={16} />
        <span className="text-gray-700">باغ ۱۱۵۰ متری با امتیازات کامل</span>
      </div>

    <SinglePostLayout post={post}/>
    </div >
  );
}