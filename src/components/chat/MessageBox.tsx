'use client';

import { useAuth } from '@/libs/hooks/useAuth';
import { useSocket } from '@/libs/hooks/useSocket';
import { ChatMessage } from '@/libs/models/chat-message';
import { formatDateNow } from '@/libs/utils/functions.util';
import { useEffect, useRef, useState } from 'react';
// استفاده از پکیج معروف react-icons
import {
  IoCheckmark,
  IoCheckmarkDone,
  IoCheckmarkDoneSharp,
} from 'react-icons/io5';

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

    socket.on('isTyping', () => {
      setIstyping(true);
      setTimeout(() => {
        setIstyping(false);
      }, 1000);
    });
    return () => {
      socket.off('messages');
      socket.off('isTyping');
      socket.off('newMessage');
    };
    // eslint-disable-next-line
  }, [socket, user?.id]);

  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col h-[calc(100vh-200px)]">
      {messages.map((message: ChatMessage) => {
        const isCurrentUser = message.senderId === user?.id;

        return (
          <div
            key={message.id}
            className={`flex mb-4 ${
              isCurrentUser ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`px-4 py-3 rounded-lg max-w-[80%] md:max-w-[70%] break-words relative ${
                isCurrentUser
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
              }`}
            >
              <div className="text-sm">{message.text}</div>
              <div
                className={`flex items-center gap-1 text-xs mt-1 text-left ${
                  isCurrentUser
                    ? 'text-red-100'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
                style={{ position: 'relative' }}
              >
                <span className="pr-5">{formatDateNow(message.sentAt)}</span>

                {isCurrentUser && (
                  <span
                    className="absolute right-0 bottom-0 flex items-center"
                    style={{ zIndex: 0, opacity: 0.7 }}
                  >
                    {message.seen ? (
                      <IoCheckmarkDoneSharp
                        size={18}
                        color={message.seen ? '#4fc3f7' : '#bdbdbd'}
                        style={{ marginRight: 2 }}
                      />
                    ) : (
                      <IoCheckmark
                        size={18}
                        color="#bdbdbd"
                        style={{ marginRight: 2 }}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {isTyping && (
        <div className="flex mb-4 justify-end">
          <div className="px-3 py-2 rounded-lg max-w-[80%] md:max-w-[60%] bg-gradient-to-r from-gray-800 via-gray-900 to-gray-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-white flex items-center gap-1 sm:gap-2 w-fit">
            <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
            <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
            <span className="block w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 dark:bg-gray-300 rounded-full animate-bounce"></span>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
