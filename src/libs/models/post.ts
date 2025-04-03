import { Category } from "./category";
import { File } from "./file";
import { User } from "./user";

export enum StatusEnum {
  Confrim = 'confirm',
  Pending = 'pending',
  Rejected = 'rejected'
}


export interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
  userId: string;
  slug: string;
  status: string;
  options: Record<string, any>;
  isActive: boolean;
  mediaFiles: File[];
  isExpired: boolean;
  expiresAt: Date;
  city: string;
  province: string;
  location: {
    lat: number;
    lng: number;
  };
  allowChatMessages: boolean;
  created_at: Date;
  updated_at: Date;
  user:User
  category:Category
}
