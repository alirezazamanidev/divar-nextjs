'use client';

import { useSocket } from '@/libs/hooks/useSocket';
import { debounce } from '@/libs/utils/functions.util';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { useMemo, useState } from 'react';

export default function MessageInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id } = useParams();
  const postId = searchParams.get('postId');
  const { socket } = useSocket();
  const [chatId, setChatId] = useState(id !== 'new' && !postId ? id : null);
  const [msg, setMsg] = useState('');
  const emitTyping = useMemo(
    () =>
      debounce(() => {
        if (!socket) return;
        if (chatId) {
          socket.emit('typing', { roomId: chatId });
        }
      }, 500),
    [socket],
  );

  const sendNewMessage = (e: any) => {
    e.preventDefault();

    if (chatId) {
      socket?.emit('send.message', { roomId: chatId, text: msg });
    } else {
      socket?.emit('send.message', { postId, text: msg }, (roomId: string) => {
        router.replace(`${roomId}`);
      });
    }
    setMsg('');
  };

  return (
    <>
      <div className="p-3 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
        <form onSubmit={sendNewMessage} className="flex">
          <input
            className="flex-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-1 text-right resize-none"
            placeholder="پیام خود را بنویسید..."
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
              emitTyping();
            }}
            //   onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            className="mr-2 bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 h-12 flex-shrink-0 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!msg.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 transform rotate-180"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
