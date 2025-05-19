import {
  Box,
  //Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  //TextField,
  // Typography,
  Collapse,
  Typography,
  IconButton,
  CircularProgress,
  //TextField,
} from "@mui/material";
// import AppsIcon from "@mui/icons-material/Apps";
// import TableRowsIcon from "@mui/icons-material/TableRows";
import { JSX, useState, useEffect } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
//import { Link } from "react-router-dom";

// import UserProducts from "./UserProducts";
import UserProducts from "./UserProducts";
import UserBookings from "./UserBookings";
import UserBookingHistory from "./UserBookingHistory";
import useCategories from "../../services/categoryService";
//import UserSingleProduct from "./UserSingleProduct";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Import useLocation from react-router-dom
import { useLocation } from "react-router-dom";

const UserDashboard = () => {
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [component, setComponent] = useState<React.ReactElement | null>(null);

  const categoriesService = useCategories();

  // Inside the component, add this near the beginning
  const location = useLocation();
  const state = location.state as { showBookings?: boolean } | null;

  // Add an effect to check for showBookings state and open bookings tab if needed
  useEffect(() => {
    if (state && state.showBookings) {
      setBookingsOpen(true);
      handleSideBar(<UserBookings />);
    }
  }, [state]);

  // Initialize component with user products when categories are loaded
  useEffect(() => {
    if (!categoriesService.loading && categoriesService.categories) {
      setComponent(<UserProducts categories={categoriesService.categories} />);
    }
  }, [categoriesService.categories, categoriesService.loading]);

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
    // Show bookings when clicking on bookings menu item
    if (!bookingsOpen) {
      handleSideBar(<UserBookings />);
    }
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
          {/* <h2>sidebar component</h2> */}
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
                  User Dashboard
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
                          primary="Products"
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
                          primary="Bookings"
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
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon style={{ color: "white" }}>
                          <DraftsIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary="Pending"
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                            onClick={() => handleSideBar(<UserBookings />)}
                          />
                        )}
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon style={{ color: "white" }}>
                          <DraftsIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary="Booking History"
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                            onClick={() =>
                              handleSideBar(<UserBookingHistory />)
                            }
                          />
                        )}
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
                {/* <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} /> */}

                <Divider />
              </List>
            </Box>
          </Box>

          {/* <h2>(main dashboard component)</h2> */}
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
