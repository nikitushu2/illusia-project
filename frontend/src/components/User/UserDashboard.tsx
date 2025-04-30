import {
  Box,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Container,
} from "@mui/material";
import { JSX, useState, useEffect } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { BookingCartProvider } from "../../context/BookingContext";
import BookingCartDrawer from "../BookingCartDrawer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAuth } from "../../context/AuthContext";

import UserProducts from "./UserProducts";
import UserBookings from "./UserBookings";
import UserBookingsList from "../UserBookingsList";
import categoryService from "../../services/categoryService";
//import UserSingleProduct from "./UserSingleProduct";

const UserDashboard = () => {
  const { isLoggedIn, applicationUser } = useAuth();
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [component, setComponent] = useState<React.ReactElement | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log("Fetching categories...");
        const categoriesData = await categoryService.getAll();
        console.log("Fetched categories:", categoriesData);
        setCategories(categoriesData);

        // Set default component with categories
        setComponent(<UserProducts categories={categoriesData} />);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set default component without categories
        setComponent(<UserProducts />);
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

  // handle add new item
  // const handleAddNew = () => {
  //   console.log("add new item");
  // };

  return (
    <BookingCartProvider>
      <BookingCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          User Dashboard
        </Typography>

        <UserBookingsList />

        <div>
          <Box>
            {/* whole container for dashboard  with 2 sections sidebar and main dashboard component*/}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "15% 85%",
                gap: "30px",
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
                    marginLeft: "50px",
                    fontWeight: "bold",
                    marginTop: "50px",
                    marginBottom: "20px",
                  }}
                >
                  User Dashboard
                </Typography>

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
                              <UserProducts categories={categories} />
                            )
                          }
                        />
                      </ListItemButton>
                    </ListItem>

                    <Divider />
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
                              onClick={() => handleSideBar(<UserBookings />)}
                            />
                          </ListItemButton>
                          <ListItemButton sx={{ pl: 6 }}>
                            <ListItemIcon>
                              <DraftsIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary="Reservations"
                              onClick={() =>
                                handleSideBar(
                                  "<UserSingleProduct/> in case we want to remove modal view"
                                )
                              }
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
                    <Divider />
                  </List>
                </Box>
              </Box>

              {/* <h2>(main dashboard component)</h2> */}
              <Box sx={{ margin: "10px" }}>
                {/* Booking Cart toggle icon */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 2,
                    pl: 2,
                  }}
                >
                  <IconButton
                    size="large"
                    color="secondary"
                    aria-label="open booking cart"
                    onClick={() => setCartOpen(true)}
                    sx={{ p: 1 }}
                  >
                    <ShoppingCartIcon fontSize="large" />
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    marginBottom: "20px",
                    justifyContent: "center",
                    marginTop: "10px",
                    gap: "50px",
                  }}
                >
                  {/* <Button onClick={handleAddNew} component={Link} to="/adminNewProduct">ADD NEW ITEM</Button> */}

                  {/* grid and list views */}
                  {/* <Box sx={{ display: "flex", marginRight:"50px", justifyContent: "flex-end", marginTop: "10px" }}>
                        <AppsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleGridView} />
                        <TableRowsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleListView} />
                    </Box> */}
                </Box>

                {/* data here */}
                <Box sx={{ marginTop: "50px", marginRight: "50px" }}>
                  {/* DISPLAY DATA HERE    */}
                  {/* {sideLink && <Typography variant="body1" style={{ marginTop: "20px" }}>{sideLink}</Typography>} */}
                  {component || sideLink}
                </Box>
              </Box>
            </Box>
          </Box>
        </div>

        {/* This is temporary debugging code */}
        <div
          style={{ border: "1px solid red", padding: "10px", margin: "10px 0" }}
        >
          <h4>Debug Info:</h4>
          <p>User authenticated: {isLoggedIn ? "Yes" : "No"}</p>
          <p>User ID: {applicationUser?.id || "Not found"}</p>
          <p>Current state: {cartOpen ? "Cart open" : "Cart closed"}</p>
          <button onClick={() => console.log("Auth context:", applicationUser)}>
            Log User Auth Data
          </button>
          <button
            onClick={() => console.log("Calling /api/bookings/user/1 directly")}
          >
            Test API Call
          </button>
        </div>
      </Container>
    </BookingCartProvider>
  );
};

export default UserDashboard;
