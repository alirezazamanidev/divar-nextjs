'use client';

import { Post } from '@/libs/models/post';
import Image from 'next/image';

export default function ChatHeader({ post }: { post: Post }) {
  return (
    <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-md ml-3">
          {post?.mediaFiles[0] ? (
            <Image
              width={200}
              height={200}
              src={post.mediaFiles[0].url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500">
              📦
            </div>
          )}
        </div>
        <div className="flex flex-col text-right">
          <span className="font-semibold">{post?.title}</span>
        </div>
      </div>
    </div>
  );
}
