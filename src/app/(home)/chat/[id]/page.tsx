'use client';
import MessaqgeBox from '@/components/chat/MessageBox';
import MessageInput from '@/components/chat/messageInput';
import { useSocket } from '@/libs/hooks/useSocket';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatBoxPage() {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const postId = searchParams.get('postId');
  const { socket } = useSocket();
  const [chatId, setChatId] = useState(id !== 'new' && !postId ? id : null);

  useEffect(() => {
    
    if (!socket) return;
    if (chatId) {
      socket.emit('joinRoom', { roomId: chatId });
    }

    return ()=>{
      if(chatId){
        socket.emit('leaveRoom',{roomId:chatId})
      }
    }
  }, [socket,chatId]);

  

  return (
    <>
      {/* Chat header */}


      {/* Chat messages */}
      <MessaqgeBox />

      {/* Chat input */}
      <MessageInput />
    </>
  );
}
