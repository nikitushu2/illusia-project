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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { JSX, useState, useEffect } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupIcon from "@mui/icons-material/Group";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
//import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AdminProducts from "./AdminProducts";
import AdminBookingHistory from "./AdminBookingHistory";
import useCategories from "../../services/categoryService";
import { UserManagement } from "../userManagement/UserManagement";
import { AdminBookingApproval } from "../AdminBookingApproval";

import HistoryIcon from '@mui/icons-material/History';
import FeedIcon from '@mui/icons-material/Feed';
import { useTranslation } from "react-i18next";

const AdminDashboard = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [component, setComponent] = useState<React.ReactElement | null>(null);

  const categoriesService = useCategories();

  // Add effect to handle automatic collapse
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Initialize the component with admin products
  useEffect(() => {
    // Set default component with categories when they're loaded
    if (!categoriesService.loading && categoriesService.categories) {
      setComponent(
        <AdminProducts
          onEdit={(item) => console.log("Edit item", item)}
          categories={categoriesService.categories}
        />
      );
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

  // handle arrow up/down for products
  const handleProductsClick = () => {
    setProductsOpen(!productsOpen);
  };

  //handle arrow up/down for bookings
  const handleBookingsClick = () => {
    setBookingsOpen(!bookingsOpen);
    // Show bookings when clicking on bookings menu item
    if (!bookingsOpen) {
      handleSideBar(<AdminBookingApproval />);
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Function to handle Products menu item click
  const handleProductsMenuClick = () => {
    handleSideBar(
      <AdminProducts
        onEdit={(item) => console.log("Edit item", item)}
        categories={categoriesService.categories}
      />
    );
  };

  return (
    <div>
      <Box>
        {/* whole container for dashboard  with 2 sections sidebar and main dashboard component*/}
        <Box
          sx={{
            display: "flex",
            gap: "10px",
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
              width: isCollapsed ? "80px" : "240px",
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
                  {t("sidebar.adminDashboard")}
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

            {/* sidebar */}
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
                  <ListItemButton>
                    <ListItemIcon style={{ color: "white" }}>
                      <GroupIcon />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary={t("sidebar.users")}
                        slotProps={{
                          primary: { style: { color: "white" } },
                        }}
                        onClick={() => handleSideBar(<UserManagement />)}
                      />
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
                            primary: {
                              style: { color: "white" },
                              marginRight: "20px",
                            },
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
                          <FeedIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={t("sidebar.details")}
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                            onClick={() =>
                              handleSideBar(<AdminBookingApproval />)
                            }
                          />
                        )}
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon style={{ color: "white" }}>
                          <HistoryIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary={t("sidebar.bookingHistory")}
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                            onClick={() =>
                              handleSideBar(<AdminBookingHistory />)
                            }
                          />
                        )}
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
              </List>
            </Box>
          </Box>

          {/* <h2>(main dashboard component)</h2> */}
          <Box
            sx={{
              margin: "10px",
              width: isCollapsed ? "calc(100% - 100px)" : "calc(100% - 270px)",
              transition: "width 0.3s ease-in-out",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
            }}
          >
            {/* data here */}
            <Box
              sx={{
                width: "100%",
                maxWidth: "1200px",
                padding: "20px",
              }}
            >
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

export default AdminDashboard;
