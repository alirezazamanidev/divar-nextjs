'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChatBubbleLeftIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,

} from '@heroicons/react/24/outline';
import { Post } from '@/libs/models/post';
import { formatDateNow, formatPrice } from '@/libs/utils/functions.util';

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const findFirstImage = () => {
    if (!post.mediaFiles || post.mediaFiles.length === 0) return null;
    return post.mediaFiles.find((file) => file?.mimetype?.startsWith('image/'));
  };

  const firstImage = findFirstImage();
  const imageUrl = firstImage?.url || '';
  const hasImage = !!firstImage;

  return (
    <Link href={`/posts/${post.slug}`} className="block h-full">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group">
        <div className="relative h-52 overflow-hidden bg-gray-700">
          {hasImage ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
              <CameraIcon className="h-16 w-16 text-gray-500 opacity-50" />
            </div>
          )}
          {post.isExpired && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              منقضی شده
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-16"></div>
        </div>
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-sm mb-3 text-white line-clamp-2 hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
          <div className="mt-auto space-y-2">
            {(post.options?.price ||
              post.options?.rent ||
              post.options?.deposit) && (
              <div className="space-y-1 border-t border-gray-700 pt-2">
                {post.options?.price && (
                  <div className="flex items-center">
                    <p className="text-gray-400 text-sm">
                      {formatPrice(post.options.price)}{' '}
                      <span className="text-xs font-normal">تومان</span>
                    </p>
                  </div>
                )}
                {post.options?.rent && (
                  <div className="flex items-center">
                    <p className=" text-gray-400 text-sm">
                      اجاره: {formatPrice(post.options.rent)}{' '}
                      <span className="text-xs font-normal">تومان</span>
                    </p>
                  </div>
                )}
                {post.options?.deposit && (
                  <div className="flex items-center">
                
                    <p className="text-purple-400 font-bold text-sm">
                      ودیعه: {formatPrice(post.options.deposit)}{' '}
                      <span className="text-xs font-normal">تومان</span>
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between items-center mt-3 text-xs text-gray-400 border-t border-gray-700 pt-2">
              <div className="flex items-center">
                <MapPinIcon className="h-3 w-3 mr-1" />
                <span>{post.city || post.province || 'نامشخص'}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3 " />
                <span>{formatDateNow(post.created_at)}</span>
              </div>
            </div>
          </div>
          {post.allowChatMessages && (
            <div className="flex justify-end mt-3">
              <button 
                className="text-gray-400 hover:text-blue-500 transition-colors bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle chat functionality here
                }}
              >
                <ChatBubbleLeftIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
