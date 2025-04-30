import React, { createContext, useContext, useState } from "react";
import { Item } from "../services/itemService";
import bookingService, {
  Booking,
  BookingItemsData,
} from "../services/bookingService";
import { useAuth } from "./AuthContext";

// Each cart item holds the full Item object plus a selected quantity
export interface CartItem {
  item: Item;
  quantity: number;
}

// Shape of our booking cart context
interface BookingCartContextType {
  items: CartItem[];
  loading: boolean;
  error: string | null;

  addItem: (item: Item, quantity?: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;

  checkout: () => Promise<Booking | void>;
}

// Default context value (no-op implementations)
const BookingCartContext = createContext<BookingCartContextType>({
  items: [],
  loading: false,
  error: null,

  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},

  checkout: async () => {},
});

// Provider component
export const BookingCartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { applicationUser, isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add an item to the cart (aggregating quantity if already present)
  const addItem = (item: Item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  // Remove an item from the cart
  const removeItem = (itemId: number) => {
    setItems((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  // Update the quantity for a specific item
  const updateQuantity = (itemId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  // Clear the entire cart (reset everything)
  const clearCart = () => {
    setItems([]);
    setError(null);
  };

  // Submit the booking to the backend
  const checkout = async (): Promise<Booking | void> => {
    if (!isLoggedIn || !applicationUser) {
      setError("You must be logged in to checkout.");
      return;
    }
    if (items.length === 0) {
      setError("Your booking cart is empty.");
      return;
    }

    setLoading(true);
    setError(null);

    // Create the booking payload without the bookingItems first
    const bookingPayload = {
      userId: applicationUser.id,
      // Use current date + 1 day for startDate and +7 days for endDate as defaults
      startDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
      endDate: new Date(Date.now() + 86400000 * 7).toISOString(), // 1 week from tomorrow
      statusId: 1, // Pending
    };

    try {
      console.log("Creating booking with payload:", bookingPayload);
      // First create the booking
      const booking = await bookingService.create(bookingPayload);
      console.log("Booking created successfully:", booking);

      if (booking && booking.id) {
        // Then create the booking items separately
        const bookingItemsPayload: BookingItemsData = {
          bookingId: booking.id,
          items: items.map((ci) => ({
            itemId: ci.item.id,
            quantity: ci.quantity,
          })),
        };

        console.log(
          "Creating booking items with payload:",
          bookingItemsPayload
        );

        try {
          // Add booking items
          const result = await bookingService.addBookingItems(
            bookingItemsPayload
          );
          console.log("Booking items created successfully:", result);
        } catch (itemError) {
          console.error("Error creating booking items:", itemError);
          setError(
            `Booking created but items could not be added: ${
              itemError instanceof Error ? itemError.message : "Unknown error"
            }`
          );
          // Continue and return the booking even if items fail
        }
      }

      clearCart();
      return booking;
    } catch (error: unknown) {
      console.error("Checkout error:", error);
      // Better error handling: extract message if it's an Error
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to create booking.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookingCartContext.Provider
      value={{
        items,
        loading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </BookingCartContext.Provider>
  );
};

// Hook to use the booking cart context
export const useBookingCart = () => useContext(BookingCartContext);
