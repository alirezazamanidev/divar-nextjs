'use client';

import React, { useEffect, useState, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Message } from '@/libs/services/chat.service';
import { useAuth } from '@/libs/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/data/routes';
import useSocket from '@/libs/hooks/useSocket';
import { ChatRoom } from '@/libs/models/room';
import { toast } from 'react-hot-toast';
import MessageBubble from './MessageBubble';

interface EmbeddedChatProps {
  postId: string;
  postTitle: string;
}

export default function EmbeddedChat({ postId, postTitle }: EmbeddedChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    isConnected, 
    sendMessage: sendSocketMessage,
    joinRoom,
    leaveRoom,
    chatRooms
  } = useSocket();

  // Find existing chat room for this post
  useEffect(() => {
    if (chatRooms && chatRooms.length > 0) {
      const existingRoom = chatRooms.find(room => room.postId === postId);
      if (existingRoom) {
        setChatRoom(existingRoom);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [chatRooms, postId]);

  useEffect(() => {
    // Join the room if it exists
    if (chatRoom) {
      joinRoom(chatRoom.id);
    }
    
    return () => {
      if (chatRoom) {
        leaveRoom(chatRoom.id);
      }
    };
  }, [chatRoom, joinRoom, leaveRoom]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || !user) {
      toast.error('لطفا ابتدا وارد حساب کاربری خود شوید');
      return;
    }
    
    if (!chatRoom) {
      // Need to create a chat room first
      router.push(ROUTES.CHAT_CONVERSATION(postId));
      return;
    }
    
    // Optimistically add message to UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      content: inputText,
      chatRoomId: chatRoom.id,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setInputText('');
    
    // Send via socket if connected
    if (isConnected && sendSocketMessage) {
      sendSocketMessage(chatRoom.id, inputText);
    } else {
      toast.error('خطا در ارسال پیام - عدم اتصال به سرور');
    }
  };

  const handleExpandChat = () => {
    if (chatRoom) {
      router.push(ROUTES.CHAT_CONVERSATION(chatRoom.id));
    } else {
      router.push(ROUTES.CHAT_CONVERSATION(postId));
    }
  };

  return (
    <div className="w-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
      {/* Header */}
      <div className="bg-gray-900 p-3 flex items-center justify-between border-b border-gray-700">
        <h3 className="text-gray-100 font-medium">{postTitle}</h3>
        <button 
          onClick={handleExpandChat}
          className="text-xs bg-teal-700 hover:bg-teal-600 text-white px-2 py-1 rounded transition-colors"
        >
          مشاهده کامل گفتگو
        </button>
      </div>
      
      {/* Messages area - simplified version */}
      <div className="h-48 overflow-y-auto p-3 space-y-2 bg-gray-850">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : !chatRoom ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">برای شروع گفتگو، پیام خود را بنویسید</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-sm">هنوز پیامی ارسال نشده است</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === user?.id}
              simplified
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="p-3 bg-gray-900">
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-l-md border-0 p-2 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || !isConnected}
            className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 