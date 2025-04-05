import { ChatMessage } from "./chat-message";
import { Post } from "./post";
import { User } from "./user";

export interface ChatRoom {
    id: string;
    postId: string;
  
    buyerId: string;
  
    sellerId: string;
  
    isActive: boolean;
  
    created_at: Date;
  
    updated_at: Date;
  
    // Relations
    post: Post;
  
    buyer: User;
  
    seller: User;
  
    messages: ChatMessage[];
}