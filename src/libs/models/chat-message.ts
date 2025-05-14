import { ChatRoom } from './room';
import { User } from './user';

export interface ChatMessage {
  id: string;

  roomId: string;

  senderId: string;

  message: string;

  isRead: boolean;

  sentAt: Date;

  // Relations
  room: ChatRoom;

  sender: User;
}
