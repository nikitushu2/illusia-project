import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../images/logo-transparent.png";

import { Link } from "react-router-dom";
import { ThemeContext } from "../themes/themeContext";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const themeContext = useContext(ThemeContext);
  const { logout, isLoggedIn, signUp, signUpUser, isAdmin, applicationUser } =
    useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/logoutPage");
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        navigate("/adminDashboard");
      } else {
        navigate("/userDashboard");
      }
    }
  }, [isAdmin, isLoggedIn]);

  useEffect(() => {
    if (signUpUser) {
      navigate("/signup");
    }
  }, [signUpUser]);

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Make sure you are using ThemeProvider."
    );
  }

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText
              primary={
                <Typography sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  HOME
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/items">
            <ListItemText
              primary={
                <Typography sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  ITEMS
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/events">
            <ListItemText
              primary={
                <Typography sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  EVENTS
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText
              primary={
                <Typography sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  INFO
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        {isLoggedIn && (
          <ListItem>
            <Chip
              sx={{ py: 3, pl: 1 }}
              avatar={
                <Avatar
                  src={applicationUser?.picture}
                  alt={applicationUser?.email}
                />
              }
              label={
                <Typography
                  variant="body1"
                  sx={{ color: "primary.main", fontWeight: "bold" }}
                >{`${applicationUser?.email} (${applicationUser?.role})`}</Typography>
              }
              variant="outlined"
            />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
              }}
            >
              <Link to="/">
                <img
                  src={logo}
                  alt="illusia-logo"
                  style={{
                    height: "120px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </Link>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                gap: "20px",
              }}
            >
              <Button color="inherit" variant="text" component={Link} to="/">
                <Typography variant="body1">HOME</Typography>
              </Button>
              <Button
                color="inherit"
                variant="text"
                component={Link}
                to="/items"
              >
                <Typography variant="body1">STORE</Typography>
              </Button>
              <Button
                color="inherit"
                variant="text"
                component={Link}
                to="/events"
              >
                <Typography variant="body1">EVENTS</Typography>
              </Button>
              <Button color="inherit" variant="text" component={Link} to="/info">
                <Typography variant="body1">INFO</Typography>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "30px",
              }}
            >
              {isLoggedIn ? (
                <>
                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                      gap: "30px",
                    }}
                  >
                    <Chip
                      sx={{ py: 3, pl: 1 }}
                      avatar={
                        <Avatar
                          src={applicationUser?.picture}
                          alt={applicationUser?.email}
                        />
                      }
                      label={
                        <Typography
                          variant="body1"
                          sx={{ color: "primary.main", fontWeight: "bold" }}
                        >{`${applicationUser?.email} (${applicationUser?.role})`}</Typography>
                      }
                      variant="outlined"
                    />
                    <Button
                      onClick={handleLogout}
                      color="inherit"
                      variant="contained"
                      sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    >
                      Logout
                    </Button>
                  </Box>
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <Button
                      onClick={handleLogout}
                      color="inherit"
                      variant="contained"
                      sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    >
                      Logout
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Button
                    onClick={signUp}
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
                </>
              )}

              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};
