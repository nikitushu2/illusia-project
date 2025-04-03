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
    Typography,
    Collapse,
  } from "@mui/material";
  import AppsIcon from "@mui/icons-material/Apps";
  import TableRowsIcon from "@mui/icons-material/TableRows";
  import { useState } from "react";
  import LeaderboardIcon from "@mui/icons-material/Leaderboard";
  import GroupIcon from "@mui/icons-material/Group";
  import BookmarksIcon from "@mui/icons-material/Bookmarks";
  import DraftsIcon from "@mui/icons-material/Drafts";
  import ExpandLess from "@mui/icons-material/ExpandLess";
  import ExpandMore from "@mui/icons-material/ExpandMore";
  
  const SideBar = () => {
    const [sideLink, setsideLink] = useState<string | null>(null);
    const [grid, setGrid] = useState<boolean>(false);
    const [list, setList] = useState<boolean>(false);
    const [productsOpen, setProductsOpen] = useState(false);
    const [bookingsOpen, setBookingsOpen] = useState(false);
  
    // sidebar section
    const handleSideBar = (text: string) => {
      setsideLink(text);
    };
  
    // grid view
    const handleGridView = () => {
      console.log("grid");
      setGrid(!grid);
    };
  
    // list view
    const handleListView = () => {
      console.log("list");
      setList(!list);
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
    
            {/* <h2>(main dashboard component)</h2> */}
            <Box sx={{ margin: "10px" }}>
              
              <Box sx={{ display: "flex", marginBottom: "20px", justifyContent: "center", marginTop: "50px", gap: "50px" }}>
                <TextField label="search item" sx={{ width: "60%" }}></TextField>
                <Button>ADD NEW ITEM</Button>


                {/* grid and list views */}
                <Box sx={{ display: "flex", marginRight:"50px", justifyContent: "flex-end", marginTop: "10px" }}>
                    <AppsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleGridView} />
                    <TableRowsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleListView} />
                </Box>
              </Box>
  
                {/* data here */}
              <Box sx={{ marginTop: "50px" }}>    
              {sideLink && <Typography variant="body1" style={{ marginTop: "20px" }}>{sideLink}</Typography>}
              </Box>
              
            </Box>
          </Box>
        </Box>
      </div>
    );
  };
  
  export default SideBar;