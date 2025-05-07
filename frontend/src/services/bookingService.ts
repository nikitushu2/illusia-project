import axios from 'axios';
import { API_URL } from '../config/constants';
import { BookingStatus } from '../types/booking';

// Types
export interface Booking {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  status: BookingStatus;
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
  status: BookingStatus;
  items: {
    itemId: number;
    quantity: number;
  }[];
}

// Create authenticated axios instance
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies with every request
});

// Booking service
const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    try {
      const response = await authAxios.get('/private/bookings/my-bookings');
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Booking> => {
    try {
      const response = await authAxios.get(`/private/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    console.log("Creating booking with data:", data);
    try {
      const response = await authAxios.post('/private/bookings', data);
      console.log("Booking created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Booking>): Promise<Booking> => {
    try {
      const response = await authAxios.put(`/private/bookings/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/private/bookings/${id}`);
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  cancel: async (id: number): Promise<Booking> => {
    try {
      const response = await authAxios.post(`/private/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error;
    }
  },

  complete: async (id: number): Promise<Booking> => {
    try {
      const response = await authAxios.post(`/private/bookings/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing booking ${id}:`, error);
      throw error;
    }
  }
};

export default bookingService; 