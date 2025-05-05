import axios from 'axios';
import { API_URL } from '../config/constants';
import authService from './authService';

// Types
export interface Booking {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items?: BookingItem[];
}

export interface BookingItem {
  id: number;
  bookingId: number;
  itemId: number;
  quantity: number;
  item?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export interface CreateBookingData {
  startDate: string;
  endDate: string;
  userId?: number;
  items: {
    itemId: number;
    quantity: number;
  }[];
}

// Create authenticated axios instance
const authAxios = axios.create({
  baseURL: API_URL,
});

// Add authorization header to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Booking service
const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const response = await authAxios.get('/private/bookings');
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await authAxios.get(`/private/bookings/${id}`);
    return response.data;
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    const response = await authAxios.post('/private/bookings', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Booking>): Promise<Booking> => {
    const response = await authAxios.put(`/private/bookings/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await authAxios.delete(`/private/bookings/${id}`);
  },

  cancel: async (id: number): Promise<Booking> => {
    const response = await authAxios.post(`/private/bookings/${id}/cancel`);
    return response.data;
  },

  complete: async (id: number): Promise<Booking> => {
    const response = await authAxios.post(`/private/bookings/${id}/complete`);
    return response.data;
  }
};

export default bookingService; 