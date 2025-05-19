'use client';
import MessaqgeBox from '@/components/chat/MessageBox';
import MessageInput from '@/components/chat/messageInput';
import ChatHeader from '@/components/layouts/chat/chatHeader';
import { useSocket } from '@/libs/hooks/useSocket';
import { Post } from '@/libs/models/post';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ChatBoxPage() {
  const searchParams = useSearchParams();
  const { id } = useParams();
  const postId = searchParams.get('postId');
  const { socket } = useSocket();
  const [chatId, setChatId] = useState(id !== 'new' && !postId ? id : null);
  const [post,setPost]=useState<Post>()
  useEffect(() => {
    
    if (!socket) return;
    if (chatId) {
      socket.emit('joinRoom', { roomId: chatId });
    }
    socket.on('getChatInfo',(data:Post)=>{
      setPost(data);
    })
    return ()=>{
      if(chatId){
        socket.emit('leaveRoom',{roomId:chatId})
      }
    }
  }, [socket,chatId]);

  

  return (
    <>

      {/* Chat header */}
      <ChatHeader post={post!}/>

      {/* Chat messages */}
      <MessaqgeBox />

      {/* Chat input */}
      <MessageInput />
    </>
  );
}
