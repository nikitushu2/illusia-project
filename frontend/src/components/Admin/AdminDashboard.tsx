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
} from "@mui/material";
import { JSX, useState, useEffect } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupIcon from "@mui/icons-material/Group";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AdminBookings from "./AdminBookings";
import AdminProducts from "./AdminProducts";
import useCategories from "../../services/categoryService";
import { UserManagement } from "../userManagement/UserManagement";

const AdminDashboard = () => {
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [component, setComponent] = useState<React.ReactElement | null>(null);

  const categoriesService = useCategories();

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
                  color="white"
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    marginTop: "50px",
                    marginBottom: "20px",
                  }}
                >
                  Admin Dashboard
                </Typography>
              )}
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "60px",
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
                marginTop: "120px",
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
                        {productsOpen ? (
                          <ExpandLess style={{ color: "white" }} />
                        ) : (
                          <ExpandMore style={{ color: "white" }} />
                        )}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
                <Collapse
                  in={productsOpen && !isCollapsed}
                  timeout="auto"
                  unmountOnExit
                >
                  <ListItem disablePadding>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon style={{ color: "white" }}>
                          <LeaderboardIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary="Inventory"
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                            onClick={() => handleSideBar("Display inventory")}
                          />
                        )}
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon style={{ color: "white" }}>
                      <GroupIcon />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary="Users"
                        slotProps={{
                          primary: { style: { color: "white" } },
                        }}
                        onClick={() => handleSideBar(<UserManagement />)}
                      />
                    )}
                  </ListItemButton>
                </ListItem>

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
                            onClick={() => handleSideBar(<AdminBookings />)}
                          />
                        )}
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon style={{ color: "white" }}>
                          <DraftsIcon />
                        </ListItemIcon>
                        {!isCollapsed && (
                          <ListItemText
                            primary="Reservations"
                            slotProps={{
                              primary: { style: { color: "white" } },
                            }}
                            onClick={() =>
                              handleSideBar("Display reservations")
                            }
                          />
                        )}
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon style={{ color: "white" }}>
                      <DraftsIcon />
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText
                        primary="Messages"
                        slotProps={{
                          primary: { style: { color: "white" } },
                        }}
                        onClick={() => handleSideBar("Display messages")}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Box>

          {/* <h2>(main dashboard component)</h2> */}
          <Box
            sx={{
              margin: "10px",
              width: isCollapsed ? "calc(100% - 100px)" : "calc(100% - 300px)",
              transition: "width 0.3s ease-in-out",
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

export default AdminDashboard;
