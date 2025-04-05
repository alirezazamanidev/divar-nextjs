import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { ChatMessage } from '@/libs/models/chat-message';
import { formatDateNow } from '@/libs/utils/functions.util';

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  simplified?: boolean;
}

export default function MessageBubble({ message, isOwn, simplified = false }: MessageBubbleProps) {
  

  // Smaller padding and font sizes for simplified mode
  const padding = simplified ? 'px-2 py-1' : 'px-4 py-2';
  const textSize = simplified ? 'text-xs' : 'text-sm';
  const timeSize = simplified ? 'text-[10px]' : 'text-xs';
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`max-w-[80%] rounded-lg ${padding} ${
          isOwn
            ? 'bg-[#2b5278] text-white rounded-tr-none'
            : 'bg-[#182533] text-white rounded-tl-none'
        } shadow-sm`}
      >
        <p className={textSize}>{message.message}</p>
        <div className={`flex items-center justify-end ${timeSize} mt-1 ${isOwn ? 'text-gray-300' : 'text-gray-400'}`}>
          {isOwn && (
            <span className="flex items-center mr-1">
              {message.isRead ? (
                <div className="flex text-[#34b7f1]">
                  <CheckIcon className={simplified ? "h-2.5 w-2.5" : "h-3 w-3"} />
                  <CheckIcon className={simplified ? "h-2.5 w-2.5 -mr-1" : "h-3 w-3 -mr-1"} />
                </div>
              ) : (
                <div className="flex text-gray-400">
                  <CheckIcon className={simplified ? "h-2.5 w-2.5" : "h-3 w-3"} />
                  <CheckIcon className={simplified ? "h-2.5 w-2.5 -mr-1" : "h-3 w-3 -mr-1"} />
                </div>
              )}
            </span>
          )}
          <span>{formatDateNow(message.created_at)}</span>
        </div>
      </div>
    </div>
  );
} 