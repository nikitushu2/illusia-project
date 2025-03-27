import { createTheme } from "@mui/material/styles";

export const theme = (mode: "light" | "dark") => 
  createTheme({
    palette: {
      mode, // "light" or "dark"
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff", // Dark background for dark mode
      },

      /* text: {
        primary: mode === "dark" ? "#ffffff" : "#000000", // Text color for dark mode
      },
      primary: {
        main: mode === "dark" ? "#90caf9" : "#1976d2", 
      },
      secondary: {
        main: mode === "dark" ? "#f48fb1" : "#dc004e",
      }, */
    },
  });
