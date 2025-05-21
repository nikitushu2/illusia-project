import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { JSX, useState, useEffect } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import UserProducts from "./UserProducts";
import useCategories from "../../services/categoryService";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useLocation, Link, useNavigate } from "react-router-dom";

import HistoryIcon from '@mui/icons-material/History';
import FeedIcon from '@mui/icons-material/Feed';
import { useTranslation } from "react-i18next";

const UserDashboard = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [component, setComponent] = useState<React.ReactElement | null>(null);

  const categoriesService = useCategories();
  const navigate = useNavigate();

  // Inside the component, add this near the beginning
  const location = useLocation();
  const state = location.state as {
    showBookings?: boolean;
    selectDates?: boolean;
    scrollToDates?: boolean;
  } | null;

  // Add an effect to check for showBookings state and open bookings tab if needed
  useEffect(() => {
    if (state && state.showBookings) {
      setBookingsOpen(true);
      // Use React Router's navigate function instead of window.location.href
      navigate("/userBookings");
    }

    // Handle selectDates or scrollToDates state if it exists
    if (state && (state.selectDates || state.scrollToDates)) {
      // Focus on Products section which contains the date picker
      setProductsOpen(true);
      handleProductsMenuClick();

      // Wait for the component to render, then scroll to the date picker section
      setTimeout(() => {
        const datePickerElement = document.getElementById(
          "date-picker-section"
        );
        if (datePickerElement) {
          datePickerElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
    }
  }, [state, navigate]);

  // Initialize component with user products when categories are loaded
  useEffect(() => {
    if (!categoriesService.loading && categoriesService.categories) {
      setComponent(<UserProducts categories={categoriesService.categories} />);
    }
  }, [categoriesService.categories, categoriesService.loading]);

  // Add effect to handle automatic collapse
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  const handleSideBar = (content: JSX.Element | string) => {
    if (typeof content === "string") {
      setsideLink(content);
      setComponent(null);
    } else {
      setComponent(content);
      setsideLink(null);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // handle arrow up/down for products
  const handleProductsClick = () => {
    setProductsOpen(!productsOpen);
  };

  //handle arrow up/down for bookings
  const handleBookingsClick = () => {
    setBookingsOpen(!bookingsOpen);
  };

  // Function to handle Products menu item click
  const handleProductsMenuClick = () => {
    handleSideBar(<UserProducts categories={categoriesService.categories} />);
  };

  return (
    <div>
      <Box>
        {/* whole container for dashboard  with 2 sections sidebar and main dashboard component*/}
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            margin: "10px",
          }}
        >
          <Box
            sx={{
              minHeight: "100vh",
              backgroundColor: "#44195b",
              padding: "20px",
              borderRadius: "8px 0 0 8px", // Rounded corners only on the right side
              width: isCollapsed ? "80px" : "290px",
              transition: "width 0.3s ease-in-out",
              position: "relative",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {!isCollapsed && (
                <Typography
                  variant="h5"
                  color="white"
                  sx={{
                    fontWeight: "bold",
                    marginTop: "50px",
                    marginBottom: "50px",
                  }}
                >
                  {t("sidebar.userDashboard")}
                </Typography>
              )}
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "10px",
                }}
                style={{ color: "white" }}
              >
                {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                marginTop: "100px",
              }}
            >
              <List>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleProductsClick}>
                    <ListItemIcon style={{ color: "white" }}>
                      <LeaderboardIcon />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <>
                        <ListItemText
                          primary={t("sidebar.products")}
                          slotProps={{
                            primary: { style: { color: "white" } },
                          }}
                          onClick={handleProductsMenuClick}
                        />
                      </>
                    )}
                  </ListItemButton>
                </ListItem>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />
                <ListItem disablePadding>
                  <ListItemButton onClick={handleBookingsClick}>
                    <ListItemIcon style={{ color: "white" }}>
                      <BookmarksIcon />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <>
                        <ListItemText
                          primary={t("sidebar.bookings")}
                          slotProps={{
                            primary: { style: { color: "white" } },
                          }}
                        />
                        {bookingsOpen ? (
                          <ExpandLess style={{ color: "white" }} />
                        ) : (
                          <ExpandMore style={{ color: "white" }} />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={bookingsOpen && !isCollapsed}
                  timeout="auto"
                  unmountOnExit
                >
                  <ListItem disablePadding>
                    <List component="div" disablePadding>
                      <ListItemButton
                        sx={{ pl: 6 }}
                        component={Link}
                        to="/userBookings"
                      >
                        <ListItemIcon style={{ color: "white" }}>
                          <FeedIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={t("sidebar.activeBookings")}
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                          />
                        )}
                      </ListItemButton>
                      <ListItemButton
                        sx={{ pl: 6 }}
                        component={Link}
                        to="/userBookingHistory"
                      >
                        <ListItemIcon style={{ color: "white" }}>
                          <HistoryIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={t("sidebar.bookingHistory")}
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                          />
                        )}
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
                <Divider />
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              margin: "10px",
              width: isCollapsed ? "calc(100% - 100px)" : "calc(100% - 270px)", //
              transition: "width 0.3s ease-in-out",

              display: "flex",
              justifyContent: "center",
            }}
          >
            {/* data here */}
            <Box sx={{ marginTop: "50px", marginRight: "50px" }}>
              {categoriesService.loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                component || sideLink
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default UserDashboard;
