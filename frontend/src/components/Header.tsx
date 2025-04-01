import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { ThemeContext } from "../themes/themeContext";
import { useContext } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export const Header = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Make sure you are using ThemeProvider."
    );
  }

  const { mode, toggleMode } = themeContext;

  return (
    <AppBar position="static" color="transparent">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              alignItems: "center",
              display: { xs: "none", md: "flex" },
              mr: 1,
            }}
          >
            <img
              src={logo}
              alt="illusia-logo"
              style={{ height: "100px", width: "auto", objectFit: "contain" }}
            />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              gap: "30px",
            }}
          >
            <Button
              color="inherit"
              variant="text"
              sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              variant="text"
              sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              Events/Exhibitions
            </Button>
            <Button
              color="inherit"
              variant="text"
              sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
            >
              Info
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <Button
              to="/signup"
              component={Link}
              color="inherit"
              variant="contained"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Sign Up
            </Button>
            <Button
              to="/login"
              component={Link}
              color="inherit"
              variant="contained"
              sx={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Log In
            </Button>
            <IconButton onClick={toggleMode} color="inherit">
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
