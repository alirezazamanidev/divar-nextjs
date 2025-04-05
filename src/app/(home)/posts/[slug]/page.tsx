
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
  

    <SinglePostLayout post={post}/>
    </div >
  );
}