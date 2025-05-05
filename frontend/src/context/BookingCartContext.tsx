import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Item } from "../services/itemService";

// Define types
export interface CartItem extends Item {
  quantity: number;
}

interface BookingCartContextType {
  items: CartItem[];
  addItem: (item: Item) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
}

// Create context with a default value
const BookingCartContext = createContext<BookingCartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
  totalItems: 0,
});

// Key for localStorage
const CART_STORAGE_KEY = "booking_cart_items";

// Provider component
interface BookingCartProviderProps {
  children: ReactNode;
}

export const BookingCartProvider = ({ children }: BookingCartProviderProps) => {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem(CART_STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: Item) => {
    console.log("Adding item to cart:", item);
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        // If item already exists, increment quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return newItems;
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    // Remove the auto-opening of cart
  };

  const removeItem = (itemId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    totalItems,
  };

  return (
    <BookingCartContext.Provider value={value}>
      {children}
    </BookingCartContext.Provider>
  );
};

// Custom hook to use the cart context
export function useBookingCart() {
  const context = useContext(BookingCartContext);
  return context;
}
