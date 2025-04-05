import axios from 'axios';
import { ROUTES } from '@/data/routes';
import { Feacher } from '../helpers/Feacher';
import useSWR from 'swr';
import { callApi } from '../helpers/callapi';
import { handleApiError } from '../helpers/errorHandler';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  chatRoomId: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  postId: string;
  postTitle: string;
  postImage: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  participants: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

 export const createChatRoom = async (postId: string) => {
  try {
    const response = await callApi.post('chat/create-room', { postId });
    if (response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    handleApiError(error);
  }

};
