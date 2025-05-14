export enum BookingStatus {
    RESERVED = "RESERVED",
    CANCELLED = "CANCELLED",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
    IN_QUEUE = "IN_QUEUE",
}

export interface BookingWithDetails {
    id: number;
    user: {
      id: number;
      email: string;
      displayName: string;
    };
    startDate: Date;
    endDate: Date;
    status: BookingStatus;
    createdAt: Date;
    items: Array<{
      id: number;
      itemId: number;
      quantity: number;
    }>;
}

export interface CreateBookingData {
  userId: number;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  items: Array<{
    itemId: number;
    quantity: number;
  }>;
}

export interface UpdateBookingData {
  id: number;
  userId?: number;
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus;
  items?: Array<{
    id?: number;
    itemId: number;
    quantity: number;
  }>;
}