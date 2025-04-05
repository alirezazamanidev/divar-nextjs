'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

import { ROUTES } from '@/data/routes';
import { toast } from 'react-hot-toast';
import { useSocket } from '@/libs/hooks/useSocket';

interface StartConversationProps {
  postId: string;
  postTitle: string;
}

export default function StartConversation({ postId }: StartConversationProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const { isConnected,socket } = useSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      socket.emit('createChatRoom',{postId,message},(data:any)=>{
        console.log(data);
        
      })
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('خطا در ارسال پیام');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="پیام خود را برای فروشنده بنویسید..."
          className="w-full bg-gray-700 text-gray-100 rounded-lg p-3 min-h-[80px] focus:ring-2 focus:ring-purple-500 outline-none resize-none border border-gray-600"
          dir="rtl"
        />
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-400">با ارسال پیام، گفتگوی خصوصی آغاز می‌شود</p>
          <button
            type="submit"
            disabled={!message.trim() || isLoading || !isConnected}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 shadow-md shadow-purple-900/30"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : !isConnected ? (
              "در حال اتصال..."
            ) : (
              <>
                <PaperAirplaneIcon className="h-4 w-4" />
                ارسال
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 