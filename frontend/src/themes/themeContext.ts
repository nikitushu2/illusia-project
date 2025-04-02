import { createContext, useContext } from "react";


// Define the context type
interface ThemeContextType {
  typography: any;
  mode: 'light' | 'dark';
  toggleMode: () => void;
}


export const ThemeContext = createContext<ThemeContextType | undefined>({
  mode: 'light', 
  toggleMode: () => {}
});

export const useTheme = () => useContext(ThemeContext);