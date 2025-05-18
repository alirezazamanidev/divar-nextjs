import { ChatRoom } from './room';
import { User } from './user';

export interface ChatMessage {
  id: string;

  roomId: string;

  senderId: string;

  text: string;

  seen: boolean;

  sentAt: Date;

  // Relations
  room: ChatRoom;

  sender: User;
}
