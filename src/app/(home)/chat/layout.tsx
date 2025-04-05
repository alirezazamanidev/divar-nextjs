import ChatLayout from '@/components/chat/ChatLayout';

export default function ChatRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ChatLayout>{children}</ChatLayout>;
}
