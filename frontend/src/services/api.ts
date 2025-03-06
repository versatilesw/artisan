import axios from 'axios';
import type { Message } from '../types/message';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  getMessages: async (): Promise<Message[]> => {
    const response = await api.get<Message[]>('/messages');
    return response.data;
  },

  sendMessage: async (content: string): Promise<Message> => {
    const response = await api.post<Message>('/messages', {
      content,
      sender: 'user',
    });
    return response.data;
  },

  updateMessage: async (id: number, content: string): Promise<Message> => {
    const response = await api.put<Message>(`/messages/${id}`, {
      content,
    });
    return response.data;
  },

  deleteMessage: async (id: number): Promise<void> => {
    await api.delete(`/messages/${id}`);
  },
};
