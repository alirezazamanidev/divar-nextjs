'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Conversation } from '@/libs/services/chat.service';
import { ROUTES } from '@/data/routes';
import { ChatRoom } from '@/libs/models/room';
import { formatDateNow } from '@/libs/utils/functions.util';

interface ConversationListProps {
  conversations: ChatRoom[];
}

export default function ConversationList({ conversations }: ConversationListProps) {
  const pathname = usePathname();

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-sm md:text-base">هیچ گفتگویی وجود ندارد</p>
        <p className="mt-2 text-xs text-gray-500">گفتگوهای شما اینجا نمایش داده خواهند شد</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-700">
      {conversations.map((conversation) => {
        const isActive = pathname === `/chat/${conversation.id}`;
        const lastMessage = conversation?.messages[conversation?.messages?.length - 1]?.message;
        
        return (
          <li key={conversation.id} className="transition-all duration-200 hover:scale-[0.99]">
            <Link
              href={ROUTES.CHAT_CONVERSATION(conversation.id)}
              className={`flex items-center p-3 sm:p-4 hover:bg-gray-700/70 transition-colors ${
                isActive ? 'bg-gray-700 border-r-4 border-teal-500' : ''
              }`}
            >
              <div className="relative flex-shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-lg overflow-hidden mr-3 shadow-md">
                <Image
                  src={conversation?.post?.mediaFiles[0]?.url || '/placeholder.jpg'}
                  alt={conversation?.post?.title || ''}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-110"
                />
                {isActive && (
                  <div className="absolute inset-0 bg-teal-500/20 border border-teal-500/50"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className={`text-sm font-medium sm:text-base ${isActive ? 'text-teal-400' : 'text-gray-100'} truncate max-w-[70%]`}>
                    {conversation?.post?.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center">
                    {isActive && (
                      <span className="h-2 w-2 bg-teal-500 rounded-full mr-1.5 animate-pulse"></span>
                    )}
                    {formatDateNow(conversation?.updated_at)}
                  </span>
                </div>  
                
                <p className={`mt-1 text-xs sm:text-sm truncate ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                  {lastMessage || 'بدون پیام'}
                </p>
                
                {/* {conversation.unreadCount > 0 && (
                  <div className="mt-1.5 flex justify-end">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-teal-100 bg-teal-700 rounded-full animate-pulse">
                      {conversation.unreadCount}
                    </span>
                  </div>
                )} */}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
} 