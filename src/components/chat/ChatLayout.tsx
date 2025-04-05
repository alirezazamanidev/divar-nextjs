'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Message, Conversation } from '@/libs/services/chat.service';
import ConversationList from './ConversationList';

import { ChatRoom } from '@/libs/models/room';
import { useSocket } from '@/libs/hooks/useSocket';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { isConnected, socket } = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  
  useEffect(() => {
    if (isConnected && socket) {
      // Get initial chat rooms
      socket.emit('getChatRooms', ({data}: { data: ChatRoom[] }) => { 
        if(data){
          setChatRooms(data);
        }
        setIsLoading(false);
      });
      
      // Listen for new chat rooms
      const handleNewChatRoom = (data: ChatRoom) => {
      
        setChatRooms(prevRooms => [...prevRooms, data]);
      };
      
      socket.on('newChatRoom', handleNewChatRoom);
      
      // Cleanup listener when component unmounts
      return () => {
        socket.off('newChatRoom', handleNewChatRoom);
      };
    }
  }, [isConnected, socket]);

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-900">
      {/* Conversation sidebar */}
      <div className="w-80 border-l border-gray-700 overflow-y-auto bg-gray-800">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">چت دیوار</h2>
          {!isConnected && (
            <p className="text-xs text-red-400 mt-1">
              اتصال به سرور برقرار نیست
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="p-4 text-center text-gray-400">
            در حال بارگذاری گفتگوها...
          </div>
        ) : (
          <ConversationList conversations={chatRooms} />
        )}
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
