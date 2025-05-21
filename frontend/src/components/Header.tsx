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
import LanguageIcon from "@mui/icons-material/Language";
import logo from "../images/logo-transparent.png";

import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../themes/themeContext";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useBookingCart } from "../context/BookingCartContext";
import BookingCartDrawer from "./BookingCart/BookingCartDrawer";
import ShoppingCartIconComponent from "./ShoppingCartIcon";
import { useTranslation } from "react-i18next";

enum Locale {
  EN = "en",
  FI = "fi",
}

const LocaleSelector = () => {
  const { i18n } = useTranslation();

  const handleLocaleChange = (lang: Locale) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", color: "primary.main" }}>
      <LanguageIcon />
      <select
        defaultValue={i18n.language as Locale}
        onChange={(event) => handleLocaleChange(event.target.value as Locale)}
        style={{
          border: "none",
          color: "inherit",
          fontSize: "1rem",
          fontWeight: "bold",
          marginLeft: "4px",
        }}
      >
        <option value={Locale.EN}>EN</option>
        <option value={Locale.FI}>FI</option>
      </select>
    </Box>
  );
};

export const Header = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const themeContext = useContext(ThemeContext);
  const { logout, isLoggedIn, signUp, signUpUser, isAdmin, applicationUser } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCartOpen, closeCart } = useBookingCart();
  const isUserDashboard = location.pathname === "/userDashboard";

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
                  {t("common.home")}
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
                  {t("headerPage.items")}
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
                  {t("headerPage.events")}
                </Typography>
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/info">
            <ListItemText
              primary={
                <Typography sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}>
                  {t("headerPage.info")}
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
      <AppBar position="static" sx={{height:"100px"}}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                width: "200px",
                height: "100px",
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
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Button color="inherit" variant="text" component={Link} to="/">
                <Typography variant="body1">{t("common.home")}</Typography>
              </Button>
              <Button
                color="inherit"
                variant="text"
                component={Link}
                to="/items"
              >
                <Typography variant="body1">{t("headerPage.store")}</Typography>
              </Button>
              <Button
                color="inherit"
                variant="text"
                component={Link}
                to="/events"
              >
                <Typography variant="body1">
                  {t("headerPage.events")}
                </Typography>
              </Button>
              <Button
                color="inherit"
                variant="text"
                component={Link}
                to="/info"
              >
                <Typography variant="body1">{t("headerPage.info")}</Typography>
              </Button>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                width: "200px",
                justifyContent: "flex-end",
              }}
            >
              {isLoggedIn ? (
                <>
                  {isUserDashboard && !isAdmin && <ShoppingCartIconComponent />}

                  <Box
                    sx={{
                      display: { xs: "none", md: "flex" },
                      alignItems: "center",
                      gap: "2px",
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
                        >{`(${applicationUser?.role})`}</Typography>
                      }
                    />
                    <Button
                      onClick={handleLogout}
                      // color="inherit"
                      // variant="contained"
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        padding: "10px 10px",
                      }}
                    >
                      {t("headerPage.logout")}
                    </Button>
                  </Box>
                  <Box sx={{ display: { xs: "block", md: "none" } }}>
                    <Button
                      onClick={handleLogout}
                      // color="inherit"
                      // variant="contained"
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        padding: "10px 10px",
                      }}
                    >
                      {t("headerPage.logout")}
                    </Button>
                  </Box>
                </>
              ) : (
                <>
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                    <Button
                      onClick={signUp}
                      // color="inherit"
                      // variant="contained"
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        padding: "10px 10px",
                      }}
                    >
                      {t("headerPage.signup")}
                    </Button>
                    <Button
                      to="/login"
                      component={Link}
                      // color="inherit"
                      // variant="contained"
                      sx={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        padding: "10px 10px",
                      }}
                    >
                      {t("headerPage.login")}
                    </Button>
                  </Box>
                </>
              )}
              <LocaleSelector />
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

      {/* Cart Drawer */}
      <BookingCartDrawer open={isCartOpen} onClose={closeCart} />
    </>
  );
};
