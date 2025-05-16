'use client'

import { useState } from "react";

// Mock data for conversations
const mockConversations = [
    {
      id: '1',
      postId: '101',
      postTitle: 'گوشی آیفون 13',
      postImage: '/images/iphone.jpg',
      buyerId: 'user2',
      sellerId: 'current-user-id',
      lastMessage: 'سلام، این گوشی هنوز موجود هست؟',
      unreadCount: 2,
      createdAt: '2023-07-15T10:30:00Z',
      updatedAt: '2023-07-15T14:45:00Z',
      participants: [
        {
          id: 'current-user-id',
          name: 'من',
        },
        {
          id: 'user2',
          name: 'علی احمدی',
          avatar: '',
        },
      ],
    },
    {
      id: '2',
      postId: '102',
      postTitle: 'لپ تاپ دل',
      postImage: '/images/laptop.jpg',
      buyerId: 'user3',
      sellerId: 'current-user-id',
      lastMessage: 'قیمت نهایی چقدر هست؟',
      unreadCount: 0,
      createdAt: '2023-07-14T09:20:00Z',
      updatedAt: '2023-07-14T16:30:00Z',
      participants: [
        {
          id: 'current-user-id',
          name: 'من',
        },
        {
          id: 'user3',
          name: 'مهدی رضایی',
          avatar: '',
        },
      ],
    },
    {
      id: '3',
      postId: '103',
      postTitle: 'دوچرخه کوهستان',
      postImage: '/images/bike.jpg',
      buyerId: 'current-user-id',
      sellerId: 'user4',
      lastMessage: 'کی می‌تونم بیام ببینمش؟',
      unreadCount: 1,
      createdAt: '2023-07-13T14:10:00Z',
      updatedAt: '2023-07-13T18:25:00Z',
      participants: [
        {
          id: 'current-user-id',
          name: 'من',
        },
        {
          id: 'user4',
          name: 'رضا محمدی',
          avatar: '',
        },
      ],
    },
  ];
export default function ChatSideBar(){
    const [conversations, setConversations] = useState(mockConversations);
    const [loading, setLoading] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<
      string | null
    >(null);
    const [selectedConversation, setSelectedConversation] = useState<any | null>(
      null,
    );  const handleConversationClick = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        const conversation = conversations.find((c) => c.id === conversationId);
        setSelectedConversation(conversation);
    
        // Get messages for this conversation
        // const conversationMessages =
        //   mockMessages[conversationId as keyof typeof mockMessages] || [];
        // setMessages(conversationMessages);
    
        // Mark unread messages as read
        const updatedConversations = conversations.map((c) =>
          c.id === conversationId ? { ...c, unreadCount: 0 } : c,
        );
        setConversations(updatedConversations);
      };
    
    
 return (
    <div className="w-full md:w-1/3 border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
    <div className="p-4 border-b border-gray-300 dark:border-gray-700">
      <h1 className="text-xl font-bold text-right">چت‌های من</h1>
    </div>

    <div className="overflow-y-auto h-[calc(100vh-180px)]">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            هیچ گفتگویی یافت نشد.
          </p>
        </div>
      ) : (
        conversations.map((conversation) => {
          const otherParticipant = conversation.participants.find(
            (p) => p.id !== 'current-user-id',
          );
          const isUserSeller =
            conversation.sellerId === 'current-user-id';
          const isSelected = selectedConversationId === conversation.id;

          return (
            <div
              key={conversation.id}
              className={`flex p-4 border-b border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                isSelected ? 'bg-gray-200 dark:bg-gray-700' : ''
              }`}
              onClick={() => handleConversationClick(conversation.id)}
            >
              <div className="relative mr-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-md">
                  {conversation.postImage ? (
                    <img
                      src={conversation.postImage}
                      alt={conversation.postTitle}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500">
                      📦
                    </div>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 ml-3 text-right">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {/* {formatDate(conversation.updatedAt)} */}
                  </span>
                  <h3 className="font-semibold">
                    {conversation.postTitle}
                  </h3>
                </div>

                <div className="mt-1 flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[180px]">
                    {conversation.lastMessage}
                  </div>
                  <div className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                    {isUserSeller ? 'فروش' : 'خرید'}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>

 )   
}