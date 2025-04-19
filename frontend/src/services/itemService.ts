import axios from 'axios';
import { API_URL } from '../config';

export interface Item {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;

  size: string;
  color: string;
  itemLocation: string;
  storageLocation: string;
}

export interface CreateItemData {
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  quantity: number;
  categoryId: number;

  size: string;
  color: string;
  itemLocation: string;
  storageLocation: string;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  quantity?: number;
  categoryId?: number;

  size: string;
  color: string;
  itemLocation: string;
  storageLocation: string;
}

const itemService = {
  getAll: async (): Promise<Item[]> => {
    const response = await axios.get(`${API_URL}/items`);
    return response.data;
  },

  getById: async (id: number): Promise<Item> => {
    const response = await axios.get(`${API_URL}/items/${id}`);
    return response.data;
  },

  create: async (data: CreateItemData): Promise<Item> => {
    const response = await axios.post(`${API_URL}/items`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateItemData): Promise<Item> => {
    const response = await axios.put(`${API_URL}/items/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/items/${id}`);
  }
};

export default itemService; 