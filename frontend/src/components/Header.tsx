import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import logo from "../images/logo-transparent.png";

import { Link } from "react-router-dom";
import { ThemeContext } from "../themes/themeContext";
import { useContext, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export const Header = () => {
  // concerning light and dark mode
  const themeContext = useContext(ThemeContext);
  const { logout, isLoggedIn, signUp, signUpUser, isAdmin, applicationUser } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/logoutPage");
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (isAdmin) {
        navigate("/adminDashboard");
      }
      else {
        navigate("/userDashboard");
      }
    }
  }, [isAdmin, isLoggedIn]);

  useEffect(() => {
    if (signUpUser) {
        navigate('/signup')
    }
  }, [signUpUser]);

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Make sure you are using ThemeProvider."
    );
  }
  // const { mode, toggleMode } = themeContext;
  return (
    <>
      <AppBar position="static">
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
                style={{ height: "120px", width: "auto", objectFit: "contain" }}
              />
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
                <Typography variant="body1">ITEMS</Typography>
              </Button>
              <Button color="inherit" variant="text">
                <Typography variant="body1">EVENTS</Typography>
              </Button>
              <Button color="inherit" variant="text">
                <Typography variant="body1">INFO</Typography>
              </Button>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: "30px" }}>
              {isLoggedIn 
              ? <>
                  <Chip 
                    avatar={<Avatar src={applicationUser?.picture} alt={applicationUser?.email} />}
                    label={<Typography>{`${applicationUser?.email} (${applicationUser?.role})`}</Typography>}
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
                </>
             : (<>
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
                  )
              }
            </Box>
            {/* toggleMode for light and dark mode */}
            {/* <IconButton onClick={toggleMode} color="inherit"> */}
            {/* {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />} */}
            {/* </IconButton>*/}

          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
