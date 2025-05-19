
import ChatSideBar from "@/components/layouts/chat/chatSidebar";
import { SocketProvider } from "@/libs/hooks/useSocket";

export default function ChatLayout({children}:{  children: React.ReactNode}){


  return (
    <SocketProvider>
    <div className="container border border-gray-700 py-4 my-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row  h-screen bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* Sidebar for conversation list */}
        <ChatSideBar/>
        {/* Main chat area */}
        <div className="flex flex-col w-full md:w-2/3 bg-gray-100 dark:bg-gray-900">
        {children}
        </div>
      </div>
    </div>
    </SocketProvider>

  );
    
}