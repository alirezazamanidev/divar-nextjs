"use client";

import Link from 'next/link';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface AdCardProps {
  id: number;
  title: string;
  subtitle?: string;
  price?: string;
  location: string;
  image?: string;
}

export default function AdCard({ id, title, subtitle, price, location, image }: AdCardProps) {
  return (
    <Link href={`/ads/${id}`} className="block">
      <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 text-white border border-gray-700 hover:border-gray-600 cursor-pointer">
        <div className="relative h-48 w-full overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-gray-400 text-sm">تصویر موجود نیست</span>
            </div>
          )}
          <div className="absolute bottom-2 left-2">
            <div className="bg-gray-700 rounded-full p-1.5 shadow-sm hover:bg-gray-600 transition-colors">
              <ChatBubbleLeftIcon className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-100 line-clamp-1">{title}</h3>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400 line-clamp-1">{subtitle}</p>
          )}
          {price && (
            <p className="mt-2 text-sm font-medium text-gray-200">{price}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{location}</p>
        </div>
      </div>
    </Link>
  );
} 