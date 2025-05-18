import { ChatMessage } from './chat-message';
import { Post } from './post';
import { User } from './user';

export interface ChatRoom {
  id: string;
  postId: string;

  sellerId: string;

  buyeerId: string;
  isActive: boolean;

  created_at: Date;

  // Relations
  lastMessage:ChatMessage
  post:Post

  messages: ChatMessage[];
}
