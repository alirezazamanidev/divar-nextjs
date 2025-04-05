'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Message } from '@/libs/services/chat.service';
import { useAuth } from '@/libs/hooks/useAuth';

import MessageBubble from './MessageBubble';
import { useSocket } from '@/libs/hooks/useSocket';
import { ChatMessage } from '@/libs/models/chat-message';
import { toast } from 'react-hot-toast';

interface ConversationViewProps {
  conversationId: string;
}

export default function ConversationView({ conversationId }: ConversationViewProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (isConnected && conversationId) {
      // Join the chat room
      socket.emit('joinRoom', { roomId: conversationId });
      
      // Get chat history
      socket.emit('getChatMessages', { roomId: conversationId }, ({ data }: { data: ChatMessage[] }) => {
        setMessages(data);
        setIsLoading(false);
      });

      // Listen for new messages
      socket.on('newMessage', (message: ChatMessage) => {
        setMessages(prev => [...prev, message]);
      });

      // Listen for message read status updates
      socket.on('messageRead', ({ messageId }: { messageId: string }) => {
        setMessages(prev => 
          prev.map(msg => msg.id === messageId ? { ...msg, isRead: true } : msg)
        );
      });
    }

    return () => {
      if (socket) {
        socket.emit('leaveRoom', { roomId: conversationId });
        socket.off('joinRoom');
        socket.off('getChatMessages');
        socket.off('newMessage');
        socket.off('messageRead');
      }
    };
  }, [socket, isConnected, conversationId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim() || !user) {
      toast.error('لطفا پیام خود را وارد کنید');
      return;
    }
    
 
    setInputText('');
    
    // Send via socket
    if (isConnected) {
      socket.emit('sendMessage', {
        chatRoomId: conversationId,
        message: inputText
      }, (response: { success: boolean, error?: string }) => {

        if (!response.success) {
          toast.error(response.error || 'خطا در ارسال پیام');
        }

      });
    } else {
      toast.error('اتصال به سرور برقرار نیست. لطفا مجددا تلاش کنید');
    }
  };
 
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-700 p-4 flex items-center">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-100">دامداری گاوی ۲۰۰۰ متری</h2>
          <p className="text-sm text-gray-400">در حال گفتگو با فروشنده</p>
        </div>
        {!isConnected && (
          <div className="text-red-500 text-xs">
            وضعیت: آفلاین (پیام‌ها با تاخیر ارسال خواهند شد)
          </div>
        )}
      </div>
      
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-l-md border-0 p-3 focus:ring-2 focus:ring-teal-500 outline-none"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
} 