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
    //TextField,
  } from "@mui/material";
  // import AppsIcon from "@mui/icons-material/Apps";
  // import TableRowsIcon from "@mui/icons-material/TableRows";
  import { JSX, useState } from "react";
  import LeaderboardIcon from "@mui/icons-material/Leaderboard";
  import SettingsIcon from "@mui/icons-material/Settings";
  import BookmarksIcon from "@mui/icons-material/Bookmarks";
  import DraftsIcon from "@mui/icons-material/Drafts";
  import ExpandLess from "@mui/icons-material/ExpandLess";
  import ExpandMore from "@mui/icons-material/ExpandMore";
//import { Link } from "react-router-dom";

import UserProducts from "./UserProducts";
import UserBookings from "./UserBookings";
import UserSettings from "./UserSettings";
//import UserSingleProduct from "./UserSingleProduct";


  const UserDashboard = () => {
    const [sideLink, setsideLink] = useState<string | null>(null);

    // const [grid, setGrid] = useState<boolean>(false);
    // const [list, setList] = useState<boolean>(false);

    const [productsOpen, setProductsOpen] = useState(false);
    const [bookingsOpen, setBookingsOpen] = useState(false);
    //const [component, setComponent] = useState<JSX.Element | null>(<UserProducts />);
    const [component, setComponent] = useState<React.ReactElement | null>(<UserProducts onEdit={() => {}} />);
  
   

    const handleSideBar = (content: JSX.Element | string) => {
      if (typeof content === 'string') {
        setsideLink(content);
        setComponent(null);
      } else {
        setComponent(content);
        setsideLink(null);
      }
    };
  
    // grid view
    // const handleGridView = () => {
    //   console.log("grid");
    //   setGrid(!grid);
    // };
  
    // list view
    // const handleListView = () => {
    //   console.log("list");
    //   setList(!list);
    // };
  
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
      <div>
        <Box>
          {/* whole container for dashboard  with 2 sections sidebar and main dashboard component*/}
            <Box sx={{ display: "grid", gridTemplateColumns: "15% 85%", gap: "30px", margin: "10px" }}>
            {/* <h2>sidebar component</h2> */}
            <Box sx={{ 
                  minHeight: "100vh", 
                  backgroundColor: "#f5f5f5", 
                  padding: "20px", 
                  borderRadius: "8px 0 0 8px" // Rounded corners only on the right side
                }}>
                  <Typography variant="h5" alignContent='center' justifyContent='center' sx={{ marginLeft: "50px", fontWeight: "bold" , marginTop: "50px", marginBottom: "20px"}}>
                  User Dashboard
                  </Typography>
              
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "100px" }}>
                  <List>
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleProductsClick}>
                    <ListItemIcon>
                      <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Products" onClick={() => handleSideBar(<UserProducts onEdit={(item) => console.log('Edit item:', item)} />)}/>
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
                      <ListItemText primary="Pending" onClick={() => handleSideBar(<UserBookings/>)} />
                      </ListItemButton>
                      <ListItemButton sx={{ pl: 6 }}>
                      <ListItemIcon>
                        <DraftsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Reservations" onClick={() => handleSideBar("<UserSingleProduct/> in case we want to remove modal view")} />   
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
                    <ListItemText primary="Messages" onClick={() => handleSideBar("Display messages")} />
                    </ListItemButton>
                  </ListItem>
                  <Divider />
                  <ListItem disablePadding>
                    <ListItemButton>
                    <ListItemIcon>
                      <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" onClick={() => handleSideBar(<UserSettings/>)} />
                    </ListItemButton>
                  </ListItem>
                  </List>
                </Box>
                </Box>
    
            {/* <h2>(main dashboard component)</h2> */}
            <Box sx={{ margin: "10px" }}>
                
              <Box sx={{ display: "flex", marginBottom: "20px", justifyContent: "center", marginTop: "10px", gap: "50px" }}>
               
                {/* <Button onClick={handleAddNew} component={Link} to="/adminNewProduct">ADD NEW ITEM</Button> */}


                {/* grid and list views */}
                {/* <Box sx={{ display: "flex", marginRight:"50px", justifyContent: "flex-end", marginTop: "10px" }}>
                    <AppsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleGridView} />
                    <TableRowsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleListView} />
                </Box> */}
              </Box>
  
                {/* data here */}
                <Box sx={{ marginTop: "50px" ,marginRight:"50px"}}> 
              {/* DISPLAY DATA HERE    */}
              {/* {sideLink && <Typography variant="body1" style={{ marginTop: "20px" }}>{sideLink}</Typography>} */}
              {component || sideLink}
              </Box>
              
            </Box>
          </Box>
        </Box>
      </div>
    );
  };
  
  export default UserDashboard;