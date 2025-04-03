'use client'
import React, { useEffect, useState } from 'react';
import PostCard from './postCard';
import { ApiPagination, GetPosts } from '@/libs/services/post.service';
import { useSearchParams } from 'next/navigation';
import { CameraIcon } from '@heroicons/react/24/outline';
import { useInView } from 'react-intersection-observer';

interface PostsGridProps {
  postPaginstion: ApiPagination
}

const PostsGrid: React.FC<PostsGridProps> = ({ 
   postPaginstion
}: PostsGridProps) => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [posts, setPosts] = useState(postPaginstion.posts ?? []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Setup react-intersection-observer
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    getpostsWithChangeQuery();
  }, [category]);
  
  // Load more posts when the loadMoreRef becomes visible
  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading]);
  
  const getpostsWithChangeQuery = async () => {
    setLoading(true);
    try {
      const response = await GetPosts({
        categorySlug: category || undefined,
        page: 1
      });
      setPosts(response.posts);
      setHasMore(response.meta.pageCount > 1 || false);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await GetPosts({
        categorySlug: category || undefined,
        page: nextPage
      });
      
      if (response.posts.length > 0) {
        setPosts(prevPosts => [...prevPosts, ...response.posts]);
        setPage(nextPage);
        setHasMore(response.meta.pageCount > nextPage || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-80 bg-gray-800/90 rounded-xl border border-gray-700 p-8 shadow-lg transition-all duration-300 hover:shadow-gray-700/30">
        <CameraIcon className="h-20 w-20 text-gray-400 opacity-60 mb-5 animate-pulse" />
        <h3 className="text-2xl font-bold text-gray-200 mb-3">هیچ آگهی یافت نشد</h3>
        <p className="text-gray-400 text-center">لطفا بعداً دوباره تلاش کنید یا فیلترهای جستجو را تغییر دهید</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}>
      {posts.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} />
        </div>
      ))}
      
      {/* Invisible loading trigger element */}
      {hasMore && (
        <div 
          ref={loadMoreRef}
          className="col-span-full h-10 flex items-center justify-center"
        >
          {loading && (
            <div className="animate-pulse flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostsGrid;