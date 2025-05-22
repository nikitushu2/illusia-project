import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { Item } from "../services/itemService";
import dayjs from "dayjs";

// Define types
interface ExtendedItem extends Item {
  remainingQuantity?: number;
  selectedQuantity?: number;
}

export interface CartItem extends Item {
  quantity: number;
  remainingQuantity?: number;
  selectedQuantity?: number;
}

interface BookingCartContextType {
  items: CartItem[];
  addItem: (item: Item, quantity?: number) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItems: number;
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
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
  startDate: null,
  endDate: null,
  setStartDate: () => {},
  setEndDate: () => {},
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
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Custom date setters that ensure proper formatting
  const handleSetStartDate = (date: string | null) => {
    if (date) {
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      setStartDate(formattedDate);
    } else {
      setStartDate(null);
    }
  };

  const handleSetEndDate = (date: string | null) => {
    if (date) {
      // Ensure date is in YYYY-MM-DD format
      const formattedDate = dayjs(date).format("YYYY-MM-DD");
      setEndDate(formattedDate);
    } else {
      setEndDate(null);
    }
  };

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item: ExtendedItem, quantity: number = 1) => {
    console.log("Adding item to cart:", item, "with quantity:", quantity);
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id);

      if (existingItemIndex >= 0) {
        // If item already exists, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: quantity,
          remainingQuantity: item.remainingQuantity || item.quantity,
        };
        return newItems;
      } else {
        // Add new item with specified quantity
        return [
          ...prevItems,
          {
            ...item,
            quantity: quantity,
            remainingQuantity: item.remainingQuantity || item.quantity,
          },
        ];
      }
    });
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
    setStartDate(null);
    setEndDate(null);
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
    startDate,
    endDate,
    setStartDate: handleSetStartDate,
    setEndDate: handleSetEndDate,
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
