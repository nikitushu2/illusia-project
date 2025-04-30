import axios from 'axios';
import { API_URL } from '../config';

// Authenticated axios instance for protected endpoints
const authAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// BookingItem payload for creating or reading booking items
export interface BookingItemData {
  itemId: number;
  quantity: number;
}

// Main Booking model returned from API
export interface Booking {
  id: number;
  userId: number;
  startDate: string;
  endDate: string;
  statusId: number;
  createdAt: string;
  updatedAt: string;
  bookingItems?: Array<{
    id: number;
    bookingId: number;
    itemId: number;
    quantity: number;
  }>;
}

// Payload for creating a new booking (user route)
export interface CreateBookingData {
  userId: number;
  startDate: string;
  endDate: string;
  statusId: number; // usually 1 (Pending)
  bookingItems?: BookingItemData[]; // Make bookingItems optional
}

// Payload for bulk creating booking items
export interface BookingItemsData {
  bookingId: number;
  items: BookingItemData[];
}

// Payload for updating a booking (modify dates or cancel)
export interface UpdateBookingData {
  startDate?: string;
  endDate?: string;
  statusId?: number;
}

const bookingService = {
  // Admin: fetch all bookings
  getAll: async (): Promise<Booking[]> => {
    const response = await authAxios.get('/bookings');
    return response.data;
  },

  // User: fetch bookings for a specific user
  getByUser: async (userId: number): Promise<Booking[]> => {
    const response = await authAxios.get(`/bookings/user/${userId}`);
    return response.data;
  },

  // Create a new booking
  create: async (data: CreateBookingData): Promise<Booking> => {
    const response = await authAxios.post('/bookings', data);
    return response.data;
  },

  // Add a single booking item
  addBookingItem: async (bookingId: number, itemId: number, quantity: number): Promise<{id: number; bookingId: number; itemId: number; quantity: number}> => {
    const response = await authAxios.post('/booking-items', {
      bookingId,
      itemId,
      quantity
    });
    return response.data;
  },

  // Add booking items to an existing booking (one by one instead of bulk)
  addBookingItems: async (data: BookingItemsData): Promise<Array<{id: number; bookingId: number; itemId: number; quantity: number}>> => {
    // Create items one by one instead of using bulk endpoint
    const results = [];
    for (const item of data.items) {
      try {
        const result = await bookingService.addBookingItem(data.bookingId, item.itemId, item.quantity);
        results.push(result);
      } catch (error) {
        console.error(`Error creating item ${item.itemId}:`, error);
      }
    }
    return results;
  },

  // Update an existing booking (dates or cancel)
  update: async (
    id: number,
    data: UpdateBookingData
  ): Promise<Booking> => {
    const response = await authAxios.put(`/bookings/${id}`, data);
    return response.data;
  },

  // Admin: change booking status (approve / reject)
  updateStatus: async (
    id: number,
    statusId: number
  ): Promise<Booking> => {
    const response = await authAxios.patch(
      `/bookings/${id}/status`,
      { statusId }
    );
    return response.data;
  },

  // Cancel or delete a booking
  remove: async (id: number): Promise<void> => {
    await authAxios.delete(`/bookings/${id}`);
  },
};

export default bookingService;