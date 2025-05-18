'use client'

import { useAuth } from "@/libs/hooks/useAuth";
import { useSocket } from "@/libs/hooks/useSocket";
import { useEffect, useRef, useState } from "react"
  
export default function MessaqgeBox(){

    const [messages,setMessages]=useState<any>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {socket}=useSocket()
    const {user}=useAuth()

    
    useEffect(() => {
      // Scroll to bottom of messages when messages change
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);

    useEffect(()=>{
      if(!socket) return
      socket.on('messages',(msgs)=>{
       setMessages(msgs)
        
      });
      socket.on('newMessage',(message)=>{
        setMessages((prev:any) => [...prev, message]);
      })


      return ()=>{
        socket.off('messages');
        socket.off('newMessage');
      }
    },[socket])
  
    return (
        <div className="flex-1 p-4 overflow-y-auto flex flex-col h-[calc(100vh-280px)]">
        {messages.map((message:any) => { 
          const isCurrentUser = message.senderId === user?.id
          return (
            <div
              key={message.id}
              className={`flex mb-4 ${
                isCurrentUser ? 'justify-end' : 'justify-start'
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
        <div ref={messagesEndRef} />
      </div>
    )

}