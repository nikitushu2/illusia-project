import axios from 'axios';
import { API_URL } from '../config';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  }
};

export default categoryService; 