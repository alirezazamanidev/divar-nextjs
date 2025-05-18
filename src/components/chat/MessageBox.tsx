'use client';

import { useAuth } from '@/libs/hooks/useAuth';
import { useSocket } from '@/libs/hooks/useSocket';
import { ChatMessage } from '@/libs/models/chat-message';
import { TypeIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MessaqgeBox() {
  const [messages, setMessages] = useState<any>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const [isTyping, setIstyping] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Scroll to bottom of messages when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on('messages', (msgs) => {
      setMessages(msgs);
    });
    socket.on('newMessage', (message) => {
      setMessages((prev: ChatMessage[]) => [...prev, message]);
    });
    socket.on('isTyping', (data) => {
  
      setIstyping(true);
      setTimeout(() => {
        setIstyping(false)
      }, 1000);
    });

    return () => {
      socket.off('messages');
      socket.off('newMessage');
      socket.off('isTyping');
    };
  }, [socket]);

  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col h-[calc(100vh-280px)]">
      
      {messages.map((message: any) => {
        const isCurrentUser = message.senderId === user?.id;
        return (
          <div
            key={message.id}
            className={`flex mb-4 ${
              isCurrentUser ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`px-4 py-3 rounded-lg max-w-[80%] md:max-w-[70%] break-words ${
                isCurrentUser
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div
                className={`text-xs mt-1 text-left ${
                  isCurrentUser
                    ? 'text-red-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {/* {formatMessageDate(message.createdAt)} */}
              </div>
            </div>
          </div>
        );
      })}
      {isTyping && (
       <div
      
       className="flex mb-4 justify-end"
     >
       <div className="px-3 py-2 rounded-lg max-w-[80%] md:max-w-[60%] bg-gradient-to-r from-gray-800 via-gray-900 to-gray-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white flex items-center gap-1 sm:gap-2 w-fit">
         <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
         <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
         <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></span>

       </div>
     </div>
        // <div
      
        //   className={'flex mb-4 justify-end '}
        // >
        //   <div
        //     className={`px-4 py-3 rounded-lg max-w-[80%] md:max-w-[70%] break-words bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100`}
        //   >
        //     <div className="text-sm">typeping ....</div>
        //     <div
        //       className={`text-xs mt-1 text-left text-gray-500 dark:text-gray-400`}
        //     ></div>
        //   </div>
        // </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
