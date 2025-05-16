'use client'

import { useEffect, useRef, useState } from "react"
  
export default function MessaqgeBox(){

    const [messages,setMessages]=useState<any>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);



    useEffect(() => {
      // Scroll to bottom of messages when messages change
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);
  
    return (
        <div className="flex-1 p-4 overflow-y-auto flex flex-col h-[calc(100vh-280px)]">
        {messages.map((message:any) => {
          const isCurrentUser = message.senderId === 'current-user-id';
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
                <div className="text-sm">{message.content}</div>
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