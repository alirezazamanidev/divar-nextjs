'use client';

import { useSocket } from "@/libs/hooks/useSocket";

export default function ChatPage() {
  
    const {socket}=useSocket()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
    <div className="mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-16 h-16 text-gray-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    </div>
    <h2 className="text-xl font-bold mb-2">
      پیام‌های خود را اینجا مدیریت کنید
    </h2>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      برای شروع مکالمه یک گفتگو را از سمت راست انتخاب کنید
    </p>
  </div>
  )




}
