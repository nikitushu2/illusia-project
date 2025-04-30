import { http, HttpResponse } from 'msw';
import { API_URL } from '../config';

// Define interfaces for the request body types
interface BookingData {
  userId: number;
  startDate: string;
  endDate: string;
  statusId: number;
  [key: string]: any; // Allow other fields for flexibility
}

interface BookingItemsData {
  bookingId: number;
  items: Array<{
    itemId: number;
    quantity: number;
  }>;
}

interface StatusUpdateData {
  statusId: number;
}

// Mock items data
const mockItems = [
  {
    id: 1,
    name: "Tactical Helmet",
    description: "Military-grade protective headgear",
    price: 99.99,
    imageUrl: "https://placehold.co/200x200?text=Tactical+Helmet",
    quantity: 10,
    categoryId: 1,
    itemLocation: "Storage Room A",
    size: "M",
    color: "Black"
  },
  {
    id: 2,
    name: "Combat Boots",
    description: "Durable tactical footwear",
    price: 129.99,
    imageUrl: "https://placehold.co/200x200?text=Combat+Boots",
    quantity: 15,
    categoryId: 2,
    itemLocation: "Storage Room B",
    size: "42",
    color: "Brown"
  },
  {
    id: 3,
    name: "Tactical Vest",
    description: "Modular load-bearing vest",
    price: 159.99,
    imageUrl: "https://placehold.co/200x200?text=Tactical+Vest",
    quantity: 8,
    categoryId: 2,
    itemLocation: "Storage Room A",
    size: "L",
    color: "Olive"
  },
  {
    id: 4,
    name: "Field Pack",
    description: "Tactical backpack",
    price: 89.99,
    imageUrl: "https://placehold.co/200x200?text=Field+Pack",
    quantity: 12,
    categoryId: 3,
    itemLocation: "Storage Room C",
    size: "One Size",
    color: "Camo"
  }
];

// Mock bookings data
const mockBookings = [
  {
    id: 1001,
    userId: 1,
    startDate: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    statusId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: {
      id: 1,
      name: 'Pending approval'
    },
    bookingItems: [
      {
        id: 101,
        bookingId: 1001,
        itemId: 1,
        quantity: 2,
        item: {
          id: 1,
          name: "Tactical Helmet",
          description: "Military-grade protective headgear",
          price: 99.99
        }
      }
    ]
  },
  {
    id: 1002,
    userId: 1,
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 15).toISOString(),
    statusId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: {
      id: 2,
      name: 'Reserved'
    },
    bookingItems: [
      {
        id: 102,
        bookingId: 1002,
        itemId: 2,
        quantity: 1,
        item: {
          id: 2,
          name: "Combat Boots",
          description: "Durable tactical footwear",
          price: 129.99
        }
      },
      {
        id: 103,
        bookingId: 1002,
        itemId: 3,
        quantity: 1,
        item: {
          id: 3,
          name: "Tactical Vest",
          description: "Modular load-bearing vest",
          price: 159.99
        }
      }
    ]
  },
  {
    id: 1003,
    userId: 1,
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() - 86400000).toISOString(),
    statusId: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: {
      id: 5,
      name: 'Closed/completed'
    },
    bookingItems: [
      {
        id: 104,
        bookingId: 1003,
        itemId: 4,
        quantity: 3,
        item: {
          id: 4,
          name: "Field Pack",
          description: "Tactical backpack",
          price: 89.99
        }
      }
    ]
  }
];

let nextBookingId = 1004;
let nextBookingItemId = 105;

// Helper function to check if two date ranges overlap
const datesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const s1 = new Date(start1).getTime();
  const e1 = new Date(end1).getTime();
  const s2 = new Date(start2).getTime();
  const e2 = new Date(end2).getTime();
  
  // If one range starts after the other ends, they don't overlap
  return !(e1 < s2 || e2 < s1);
};

export const handlers = [
  // GET all items
  http.get(`${API_URL}/items`, () => {
    console.log('MSW intercepted GET /items request');
    return HttpResponse.json(mockItems, { status: 200 });
  }),

  // GET item availability based on date range
  http.get(`${API_URL}/items/availability`, ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    
    console.log(`MSW intercepted GET /items/availability with startDate=${startDate}, endDate=${endDate}`);
    
    if (!startDate || !endDate) {
      return HttpResponse.json(
        { error: 'startDate and endDate are required query parameters' }, 
        { status: 400 }
      );
    }
    
    try {
      // Find all confirmed bookings (statusId !== 1) that overlap with the requested date range
      const relevantBookings = mockBookings.filter(booking => 
        booking.statusId !== 1 && // Not pending
        datesOverlap(startDate, endDate, booking.startDate, booking.endDate)
      );
      
      // Calculate booked quantities for each item during this period
      const bookedQuantities: { [key: number]: number } = {};
      
      relevantBookings.forEach(booking => {
        booking.bookingItems.forEach(item => {
          if (!bookedQuantities[item.itemId]) {
            bookedQuantities[item.itemId] = 0;
          }
          bookedQuantities[item.itemId] += item.quantity;
        });
      });
      
      // Calculate available quantities for each item
      const availableItems = mockItems.map(item => {
        const bookedQty = bookedQuantities[item.id] || 0;
        const availableQuantity = Math.max(0, item.quantity - bookedQty);
        
        return {
          ...item,
          availableQuantity,
          isAvailable: availableQuantity > 0
        };
      });
      
      return HttpResponse.json(availableItems, { status: 200 });
    } catch (error) {
      console.error('Error in availability check:', error);
      return HttpResponse.json(
        { error: 'Failed to check availability' }, 
        { status: 500 }
      );
    }
  }),

  // GET all bookings
  http.get(`${API_URL}/bookings`, () => {
    console.log('MSW intercepted GET /bookings request');
    return HttpResponse.json(mockBookings, { status: 200 });
  }),

  // GET bookings by user
  http.get(`${API_URL}/bookings/user/:userId`, ({ params }) => {
    const { userId } = params;
    console.log(`MSW intercepted GET /bookings/user/${userId} request`);
    
    const userBookings = mockBookings.filter(
      booking => booking.userId === Number(userId)
    );
    
    return HttpResponse.json(userBookings, { status: 200 });
  }),

  // GET booking by ID
  http.get(`${API_URL}/bookings/:id`, ({ params }) => {
    const { id } = params;
    console.log(`MSW intercepted GET /bookings/${id} request`);
    
    const booking = mockBookings.find(b => b.id === Number(id));
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    return HttpResponse.json(booking, { status: 200 });
  }),

  // POST create new booking
  http.post(`${API_URL}/bookings`, async ({ request }) => {
    const bookingData = await request.json() as BookingData;
    console.log('MSW intercepted POST /bookings request with data:', bookingData);
    
    if (!bookingData || typeof bookingData !== 'object') {
      return HttpResponse.json({ error: 'Invalid booking data' }, { status: 400 });
    }
    
    const newBooking = {
      id: nextBookingId++,
      ...bookingData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: {
        id: bookingData.statusId,
        name: bookingData.statusId === 1 ? 'Pending approval' : 
              bookingData.statusId === 2 ? 'Reserved' :
              bookingData.statusId === 3 ? 'Cancelled/rejected' :
              bookingData.statusId === 4 ? 'In progress' :
              'Closed/completed'
      },
      bookingItems: []
    };
    
    mockBookings.push(newBooking);
    
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  // POST create booking items
  http.post(`${API_URL}/booking-items/bulk`, async ({ request }) => {
    const data = await request.json() as BookingItemsData;
    console.log('MSW intercepted POST /booking-items/bulk with data:', data);
    
    if (!data || typeof data !== 'object' || !data.bookingId || !Array.isArray(data.items)) {
      return HttpResponse.json({ error: 'Invalid booking items data' }, { status: 400 });
    }
    
    const booking = mockBookings.find(b => b.id === data.bookingId);
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const newBookingItems = data.items.map(item => ({
      id: nextBookingItemId++,
      bookingId: data.bookingId,
      itemId: item.itemId,
      quantity: item.quantity,
      item: {
        id: item.itemId,
        name: `Mock Item ${item.itemId}`,
        description: 'Mock description',
        price: 99.99
      }
    }));
    
    booking.bookingItems = [...(booking.bookingItems || []), ...newBookingItems];
    
    return HttpResponse.json(newBookingItems, { status: 201 });
  }),

  // DELETE booking
  http.delete(`${API_URL}/bookings/:id`, ({ params }) => {
    const { id } = params;
    console.log(`MSW intercepted DELETE /bookings/${id} request`);
    
    const bookingIndex = mockBookings.findIndex(b => b.id === Number(id));
    
    if (bookingIndex === -1) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    mockBookings.splice(bookingIndex, 1);
    
    return new HttpResponse(null, { status: 204 });
  }),

  // PATCH update booking status
  http.patch(`${API_URL}/bookings/:id/status`, async ({ params, request }) => {
    const { id } = params;
    const data = await request.json() as StatusUpdateData;
    
    if (!data || typeof data !== 'object' || typeof data.statusId !== 'number') {
      return HttpResponse.json({ error: 'Invalid status update data' }, { status: 400 });
    }
    
    console.log(`MSW intercepted PATCH /bookings/${id}/status with statusId:`, data.statusId);
    
    const booking = mockBookings.find(b => b.id === Number(id));
    
    if (!booking) {
      return HttpResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    booking.statusId = data.statusId;
    booking.status = {
      id: data.statusId,
      name: data.statusId === 1 ? 'Pending approval' :
            data.statusId === 2 ? 'Reserved' :
            data.statusId === 3 ? 'Cancelled/rejected' :
            data.statusId === 4 ? 'In progress' :
            'Closed/completed'
    };
    
    return HttpResponse.json(booking, { status: 200 });
  })
]; 