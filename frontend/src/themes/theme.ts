import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    dark?: {
      main: string;
      contrastText: string;
    };
  }
  
  interface Palette {
    dark: {
      main: string;
      contrastText: string;
    };
  }
}

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#9537c7', // Highlight 1 (purple)
      contrastText: '#ffffff', // White text on purple
    },
    secondary: {
      main: '#3ec3ba', // Highlight 2 (teal)
      contrastText: '#2a2a2a', // Dark gray text on teal
    },
    background: {
      default: '#ffffff', // Light background (white)
    },
    text: {
      primary: '#2a2a2a', // Font basic 
    },
    dark: {
        main: '#44195b', // Dark purple for footer
        contrastText: '#ffffff', // White text on dark purple
    }
  },
  typography: {
    fontFamily: 'Lato, sans-serif', // Default font
    h1: {
      fontFamily: 'Roboto Slab, serif',
      fontWeight: 400, 
    },
    h2: {
      fontFamily: 'Lato, sans-serif',
      fontWeight: 100, 
    },
    h4: {
      fontFamily: 'Lato, sans-serif',
      fontWeight: 700, 
    },
    body1: {
      fontSize: '1.2rem',
      fontWeight: 500,
  }
    // Add other typography variants as needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Prevent uppercase text
          borderRadius: 20, // Rounded corners
          padding: '10px', // Padding for buttons
        },
        contained: {
          backgroundColor: '#9537c7', // Primary button color
          color: '#ffffff',
        },
        outlined: {
          borderColor: '#3ec3ba', // Secondary outline
          color: '#3ec3ba'
        }
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Link color
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff'
        }
      }
    },
    MuiToolbar: {
        styleOverrides: {
            root: {
                color: '#2a2a2a'
            }
        }
    },
    MuiPaper: {
        styleOverrides: {
            root: {
                backgroundColor: '#ffffff'
            }
        }
    },
     /* MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#9537c7", // Change icon color to purple
          },
        },
      } */
  },
});

  // ignore for now
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
