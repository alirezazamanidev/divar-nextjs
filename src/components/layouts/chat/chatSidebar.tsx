'use client';

import { useAuth } from '@/libs/hooks/useAuth';
import { useSocket } from '@/libs/hooks/useSocket';
import { ChatMessage } from '@/libs/models/chat-message';
import { ChatRoom } from '@/libs/models/room';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ChatSideBar() {
  const [conversations, setConversations] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const {user}=useAuth();

  useEffect(() => {
    if (!socket) return;
    socket.on('get-chats', (chats: ChatRoom) => {
      setConversations(chats);
    });
    socket.on('add-chat', (chat: ChatRoom) => {
      setConversations((prev: ChatRoom[]) => [...prev, chat]);
    });
    socket.on('update-lastmessage', (msg: ChatMessage) => {
      console.log('Notification received:', msg);
      setConversations((prev: ChatRoom[]) =>
        prev.map((conv) =>
          conv.id === msg.roomId ? { ...conv, lastMessage: msg } : conv,
        ),
      );
    });

    return () => {
      socket.off('get-chats');

      socket.off('add-chat');
    };
  }, [socket]);

  // useEffect(()=>{
  //   if(!socket)return
  //   socket.on('newMessage', (msg: ChatMessage) => {
  //     console.log(msg);
  //   });
  // },[socket])
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
          conversations.map((conversation: ChatRoom) => {
          
            return (
              <Link
                href={`/chat/${conversation.id}`}
                key={conversation.id}
                className={`flex p-4 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  true ? 'bg-gray-200 dark:bg-gray-700' : ''
                }`}
              >
                <div className="relative mr-3">
                {(!conversation.lastMessage.seen && conversation.lastMessage.senderId!==user?.id)  &&(
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-gray-800"></span>
                  )}
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
                      {conversation?.lastMessage?.text}
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
