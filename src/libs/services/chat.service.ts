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

export const fetchConversations = async () => {
  try {
    const response = await callApi.get('chat/conversations');
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const fetchConversationById = async (conversationId: string) => {
  try {
    const response = await callApi.get(`chat/conversation/${conversationId}`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};

export const fetchMessages = async (conversationId: string) => {
  try {
    const response = await callApi.get(`chat/messages/${conversationId}`);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  } catch (error) {
    handleApiError(error);
    return [];
  }
};

export const sendMessage = async (roomId: string, message: string) => {
  try {
    const response = await callApi.post('chat/send-message', {
      roomId,
      message,
    });
    if (response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    handleApiError(error);
    return null;
  }
};
