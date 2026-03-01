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

// Use relative path in production (same origin), or env var, or fallback to localhost for dev
const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/private`
  : (import.meta.env.PROD ? '/api/private' : 'http://localhost:3000/api/private');

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Booking service
const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    try {
      return await fetchWithAuth('/bookings/my-bookings');
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  getById: async (id: number): Promise<Booking> => {
    try {
      return await fetchWithAuth(`/bookings/${id}`);
    } catch (error) {
      console.error(`Error fetching booking ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateBookingData): Promise<Booking> => {
    try {
      return await fetchWithAuth('/bookings', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Booking>): Promise<Booking> => {
    try {
      return await fetchWithAuth(`/bookings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(`Error updating booking ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await fetchWithAuth(`/bookings/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Error deleting booking ${id}:`, error);
      throw error;
    }
  },

  cancel: async (id: number): Promise<Booking> => {
    try {
      return await fetchWithAuth(`/bookings/${id}/cancel`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Error cancelling booking ${id}:`, error);
      throw error;
    }
  },

  complete: async (id: number): Promise<Booking> => {
    try {
      return await fetchWithAuth(`/bookings/${id}/complete`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(`Error completing booking ${id}:`, error);
      throw error;
    }
  }
};

export default bookingService; 