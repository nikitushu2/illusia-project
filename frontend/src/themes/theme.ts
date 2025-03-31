import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ffffff", // Primary color 
      light: "#B971F3", 
      dark: "#57008F", 
      contrastText: "#000000", // White text on purple
    },
    secondary: {
      main: "#64BBB4", // Secondary color (teal)
      light: "#97EEE7", 
      contrastText: "#000000", // Black text on teal
    },
    background: {
      default: "#ffffff", // White background
      paper: "#f5f5f5", // Light grey paper background for the user review cards
    },
    text: {
      primary: "#000000", // text
      secondary: "#575757", // Grey text for less emphasis
    },
  },
    components: {
        MuiButton: { styleOverrides: { root: { borderRadius: 20 } } },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          },
        },
        MuiSvgIcon: {
          styleOverrides: {
            root: {
              color: "#39857F", // Change icon color to black
            },
          },
        }
      },
      typography: {
        fontFamily: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ].join(","),
        h1: { fontSize: "2.5rem", fontWeight: 600 },
        h2: { fontSize: "2rem", fontWeight: 600 },
        h3: { fontSize: "1.75rem", fontWeight: 600 },
        body1: { fontSize: "1.5rem", lineHeight: 1.5 },
        button: { textTransform: "none" },
      },
  });

  export const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#90caf9",
        light: "#63a4ff",
        dark: "#004ba0",
      },
      secondary: {
        main: "#9c27b0",
        light: "#ba68c8",
        dark: "#7b1fa2",
      },
      background: {
        default: "#000000"
      }
    },
    components: {
      MuiButton: { styleOverrides: { root: { borderRadius: 20 } } },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
        },
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#39857F", // Change icon color to black
          },
        },
      }
    },
  });
