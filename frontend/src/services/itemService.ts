import axios from 'axios';
import { API_URL } from '../config';

// Create an authenticated axios instance that includes credentials
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

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
  storage_location?: string;
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
    // Use authenticated axios for protected routes
    const response = await authAxios.post(`/private/items`, data);
    return response.data;
  },

  update: async (id: number, data: UpdateItemData): Promise<Item> => {
    // Use authenticated axios for protected routes
    const response = await authAxios.put(`/private/admin/items/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    // Use authenticated axios for protected routes
    await authAxios.delete(`/private/admin/items/${id}`);
  }
};

export default itemService; 