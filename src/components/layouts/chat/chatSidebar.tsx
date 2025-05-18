'use client';

import { useAuth } from '@/libs/hooks/useAuth';
import { useSocket } from '@/libs/hooks/useSocket';
import { ChatRoom } from '@/libs/models/room';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ChatSideBar() {
  const [conversations, setConversations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();


  useEffect(()=>{
    if(!socket) return
    socket.on('get-chats',(chats:ChatRoom)=>{
     
      
      setConversations(chats)
    })
  },[socket])

  return (
    <div className="w-full md:w-1/3 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <h1 className="text-xl font-bold text-right">چت‌های من</h1>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-180px)]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              هیچ گفتگویی یافت نشد.
            </p>
          </div>
        ) : (
          conversations.map((conversation:ChatRoom) => {

            return (
              <Link
              href={`/chat/${conversation.id}`}
                key={conversation.id}
                className={`flex p-4 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  true ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              
              >
                <div className="relative mr-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-md">
                    {conversation.post.mediaFiles[0] ? (
                      <Image
                      width={100}
                      height={100}
                        src={conversation.post.mediaFiles[0].url}
                        alt={conversation?.post?.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500">
                        📦
                      </div>
                    )}
                  </div>
                  {/* {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {conversation.unreadCount}
                    </div>
                  )} */}
                </div>

                <div className="flex-1 ml-3 text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {/* {formatDate(conversation.updatedAt)} */}
                    </span>
                    <h3 className="font-semibold">{conversation.post.title}</h3>
                  </div>

                  <div className="mt-1 flex justify-between items-center">
                    <div className="mr-3 text-sm text-gray-600 dark:text-gray-300 truncate max-w-[180px]">
                      {conversation.lastMessage.text}
                    </div>
                   
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
