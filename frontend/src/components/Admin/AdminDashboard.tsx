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
} from "@mui/material";
import { JSX, useState, useEffect } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupIcon from "@mui/icons-material/Group";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import AdminBookings from "./AdminBookings";
import AdminProducts from "./AdminProducts";
import categoryService from "../../services/categoryService";
import { UserManagement } from "../userManagement/UserManagement";

const AdminDashboard = () => {
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [component, setComponent] = useState<React.ReactElement | null>(null);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const categoriesData = await categoryService.getAll();
        console.log("Fetched categories:", categoriesData);
        setCategories(categoriesData);

        // Set default component with categories
        setComponent(
          <AdminProducts
            onEdit={(item) => console.log("Edit item", item)}
            categories={categoriesData}
          />
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set default component without categories
        setComponent(
          <AdminProducts onEdit={(item) => console.log("Edit item", item)} />
        );
      }
    };

    fetchCategories();
  }, []);

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

  return (
    <div>
      <Box>
        {/* whole container for dashboard  with 2 sections sidebar and main dashboard component*/}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "17% 83%",
            gap: "20px",
            margin: "10px",
          }}
        >
          {/* <h2>sidebar component</h2> */}
          <Box
            sx={{
              minHeight: "100vh",
              backgroundColor: "#f5f5f5",
              padding: "20px",
              borderRadius: "8px 0 0 8px", // Rounded corners only on the right side
            }}
          >
            <Typography
              variant="h5"
              alignContent="center"
              justifyContent="center"
              sx={{
                marginLeft: "30px",
                fontWeight: "bold",
                marginTop: "50px",
                marginBottom: "20px",
              }}
            >
              Admin Dashboard
            </Typography>

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
                    <ListItemIcon>
                      <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Products"
                      onClick={() =>
                        handleSideBar(
                          <AdminProducts
                            onEdit={(item) => console.log("Edit item", item)}
                            categories={categories}
                          />
                        )
                      }
                    />
                    {productsOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                  <ListItem disablePadding>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <LeaderboardIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Inventory"
                          onClick={() => handleSideBar("Display inventory")}
                        />
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
                <Divider />

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Users"
                      onClick={() => handleSideBar(<UserManagement />)}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton onClick={handleBookingsClick}>
                    <ListItemIcon>
                      <BookmarksIcon />
                    </ListItemIcon>
                    <ListItemText primary="Bookings" />
                    {bookingsOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={bookingsOpen} timeout="auto" unmountOnExit>
                  <ListItem disablePadding>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Pending"
                          onClick={() => handleSideBar(<AdminBookings />)}
                        />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon>
                          <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Reservations"
                          onClick={() => handleSideBar("Display reservations")}
                        />
                      </ListItemButton>
                    </List>
                  </ListItem>
                </Collapse>
                <Divider />

                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DraftsIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Messages"
                      onClick={() => handleSideBar("Display messages")}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          </Box>

          {/* <h2>(main dashboard component)</h2> */}
          <Box sx={{ margin: "10px" }}>
            {/* data here */}
            <Box sx={{ marginTop: "50px", marginRight: "50px" }}>
              {component || sideLink}
            </Box>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default AdminDashboard;
