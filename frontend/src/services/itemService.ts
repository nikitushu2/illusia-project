import axios, { AxiosError } from 'axios';
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

export interface ItemWithAvailability extends Item {
  availableQuantity: number;
  isAvailable: boolean;
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

  size?: string;
  color?: string;
  itemLocation?: string;
  storageLocation?: string;
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
    // Log the update payload
    console.log('Updating item with ID:', id);
    console.log('Original update payload:', JSON.stringify(data, null, 2));
    
    try {
      // First try the regular private route (which has correct update logic)
      console.log('Trying private route first...');
      const response = await authAxios.put(`/private/items/${id}`, data);
      console.log('Update successful via private route:', response.data);
      return response.data;
    } catch (privateError: unknown) {
      console.log('Private route failed, trying admin route with query parameter...');
      if (privateError instanceof AxiosError) {
        console.error('Private route error details:', privateError.response?.data || privateError.message);
      }
      
      try {
        // The admin route incorrectly expects a search query parameter
        // Add a dummy 'q' parameter to satisfy that requirement
        const response = await authAxios.put(`/private/admin/items/${id}?q=update`, data);
        console.log('Update successful via admin route:', response.data);
        return response.data;
      } catch (adminError: unknown) {
        console.error('Both update routes failed');
        if (adminError instanceof AxiosError) {
          console.error('Admin route error details:', adminError.response?.data || adminError.message);
        }
        throw adminError;
      }
    }
  },

  delete: async (id: number): Promise<void> => {
    // Use authenticated axios for protected routes
    await authAxios.delete(`/private/admin/items/${id}`);
  },

  // Check items availability for a specific date range
  checkAvailability: async (startDate: string, endDate: string): Promise<ItemWithAvailability[]> => {
    console.log(`Checking availability for date range: ${startDate} to ${endDate}`);
    
    try {
      const response = await axios.get(`${API_URL}/items/availability`, {
        params: { startDate, endDate }
      });
      
      console.log('Availability response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};

export default itemService; 