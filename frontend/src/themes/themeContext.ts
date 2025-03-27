import { createContext } from "react";


// Define the context type
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);