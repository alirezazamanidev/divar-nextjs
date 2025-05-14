import { ChatMessage } from './chat-message';
import { Post } from './post';
import { User } from './user';

export interface ChatRoom {
  id: string;
  postId: string;

  senderId: string;

  receiverId: string;

  isActive: boolean;

  created_at: Date;

  lastMessageAt: Date;
  // Relations
  sender: User;

  receiver: User;

  messages: ChatMessage[];
}
