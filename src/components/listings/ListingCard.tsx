'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChatBubbleLeftIcon, CameraIcon } from '@heroicons/react/24/outline';

// تایپ مربوط به آگهی
export interface Listing {
  id: number;
  title: string;
  price: string;
  location: string;
  time: string;
  image?: string;
  hasImage: boolean;
  isUrgent?: boolean;
}

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div 
      className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden bg-gray-700">
        {listing.hasImage && listing.image ? (
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CameraIcon className="h-12 w-12 text-gray-500" />
          </div>
        )}
        {listing.isUrgent && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            فوری
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-medium text-sm mb-2 text-white line-clamp-2">{listing.title}</h3>
        <div className="mt-auto">
          <p className="text-white font-bold">{listing.price}</p>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
            <span>{listing.location}</span>
            <span>{listing.time}</span>
          </div>
        </div>
        <div className="flex justify-end mt-3">
          <button className="text-gray-400 hover:text-blue-500 transition-colors">
            <ChatBubbleLeftIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard; 