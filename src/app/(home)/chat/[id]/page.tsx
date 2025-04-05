import React from 'react';

import { Suspense } from 'react';
import ConversationView from '@/components/chat/ConversationView';
import ChatLayout from '@/components/chat/ChatLayout';

interface ChatConversationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChatConversationPage({
  params,
}: ChatConversationPageProps) {
  const { id } = await params;
  return (
 
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        }
      >
        <ConversationView conversationId={id} />
      </Suspense>

  );
}
