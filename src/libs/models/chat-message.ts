import { ChatRoom } from "./room";
import { User } from "./user";


export interface ChatMessage {
    id: string;
  
    chatRoomId: string;
  
    senderId: string;
  
    message: string;
  
    isRead: boolean;
  
    created_at: Date;
  
    updated_at: Date;
  
    // Relations
    chatRoom: ChatRoom;
  
    sender: User;
}