import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
 // Typography,
  Collapse,
  Container,
} from "@mui/material";
import { useState } from "react";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupIcon from "@mui/icons-material/Group";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
//import { Link } from "react-router-dom";


const AdminNewProductForm = () => {
  const [sideLink, setsideLink] = useState<string | null>(null);
  const [productsOpen, setProductsOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);

  // sidebar section
  const handleSideBar = (text: string) => {
    setsideLink(text);
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
  const handleNewProduct = () => {
    console.log("New product added");
  };

  // what about switching between the pages with incomplete form


  return (
    <div>
    <Box>
      {/* whole container for dashboard  with 2 sections sidebar and main dashboard component*/}
        <Box sx={{ display: "grid", gridTemplateColumns: "20% 80%", gap: "30px", margin: "10px" }}>
        {/* <h2>sidebar component</h2> */}
            <Box sx={{ marginTop: "60px" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "100px" }}>
                <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={handleProductsClick}>
                    <ListItemIcon>
                        <LeaderboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Products" onClick={() => handleSideBar("Display products")}/>
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
                        <ListItemText primary="Inventory" onClick={() => handleSideBar("Display inventory")} />
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
                    <ListItemText primary="Users" onClick={() => handleSideBar("Display users")} />
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
                        <ListItemText primary="Pending" onClick={() => handleSideBar("Display pending bookings")} />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 6 }}>
                        <ListItemIcon>
                            <DraftsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Reservations" onClick={() => handleSideBar("Display reservations")} />
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
                </List>
            </Box>
            </Box>

        {/* <h2>(form here<)</h2> */}
        <Box sx={{ margin: "10px" }}>
        
          <Container sx={{ display: "grid", marginBottom: "5px", justifyContent: "center", marginTop: "150px", gap: "20px" }}>

          <TextField id="filled-basic" label="Item Name" variant="filled" sx={{width:"500px"}}/>
          <TextField id="filled-basic" label="Item ID" variant="filled" sx={{width:"500px"}} />
          <TextField id="filled-basic" label="Storage Details" variant="filled" sx={{width:"500px"}}/>
          <TextField id="filled-basic" label="Storage Location" variant="filled" />
          <TextField
          id="filled-multiline-flexible"
          label="Description"
          multiline
          maxRows={4}
          variant="filled"
          />
        <TextField id="filled-basic" label="Image" variant="filled" />

          <Button color="inherit" variant="contained" onClick={handleNewProduct}>SAVE</Button>

          </Container>
        </Box>
      </Box>
    </Box>
  </div>
  )
}


export default AdminNewProductForm;