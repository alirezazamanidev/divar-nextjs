import MessaqgeBox from "@/components/chat/MessageBox";
import MessageInput from "@/components/chat/messageInput";


export default function ChatBoxPage(){

    return (
        <>
        {/* Chat header */}
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
          {/* <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-md ml-3">
              {selectedConversation.postImage ? (
                <img
                  src={selectedConversation.postImage}
                  alt={selectedConversation.postTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500">
                  📦
                </div>
              )}
            </div>
            <div className="flex flex-col text-right">
              <span className="font-semibold">
                {selectedConversation.postTitle}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedConversation.sellerId === 'current-user-id'
                  ? 'فروش'
                  : 'خرید'}
              </span>
            </div>
          </div> */}
        </div>

        {/* Chat messages */}
        <MessaqgeBox/>

        {/* Chat input */}
        <MessageInput/>
      </>
    )
}