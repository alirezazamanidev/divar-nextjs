'use client';

import React from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export default function EmptyConversation() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-gray-900">
      <ChatBubbleLeftRightIcon className="h-20 w-20 text-gray-600 mb-4" />
      <h2 className="text-xl font-semibold text-gray-200 mb-2">به چت دیوار خوش آمدید</h2>
      <p className="text-gray-400 max-w-md">
        برای شروع گفتگو، یک مکالمه را از سمت راست انتخاب کنید یا از صفحه آگهی‌ها، پیامی به فروشنده ارسال کنید.
      </p>
    </div>
  );
} 