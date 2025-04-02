import { Box, Button, Divider, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import AppsIcon from '@mui/icons-material/Apps';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { useState } from "react";

const SideBar = () => {
    const [sideLink, setsideLink] = useState<string | null >(null);
    const [grid, setGrid] = useState<boolean>(false);
    const [list, setList] = useState<boolean>(false);

    // sidebar section
    const handleSideBar = (text:string) => {
        setsideLink(text);
    };

    // grid view
    const handleGridView = () => {
        console.log("grid");
        setGrid(!grid);
    }

    // list view
    const handleListView = () => {
        console.log("list");
        setList(!list);
    }
    
     
  return (
    <div>
        <Box> 
            {/* whole container for dashboard  with 2 sections sidebar and main dashboard conmponent*/}
            <Box sx={{ display: "grid", gridTemplateColumns: "20% 80%", gap:"0px", margin:"20px"}}>
                
                {/* <h2>sidebar component</h2> */}
                <Box sx={{margin:"10px"}}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" , marginTop:"100px"}}>
                        <List >
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="Inventory" onClick={()=>handleSideBar('Display inventory')}/>
                                </ListItemButton>
                            </ListItem>
                           
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="Products" onClick={()=>handleSideBar('Display Products')}/>
                                </ListItemButton>
                            </ListItem>
                            <Divider/>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="Users" onClick={()=>handleSideBar('Display Users')}/>
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="Bookings" onClick={()=>handleSideBar('Display Bookings')}/>
                                </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemText primary="Messages" onClick={()=>handleSideBar('Display Messages')}/>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
               
                <Box sx={{margin:"10px"}}> 
                {/* <h2>(main dashboard component)</h2> */}
                <Box sx={{ display: "flex", marginBottom:"20px", justifyContent:"center", marginTop:"50px", gap:"50px"}}>
                    <TextField label="search item" sx={{width:"60%"}}></TextField>
                    <Button>ADD NEW ITEM</Button>
                </Box>

                <Box sx={{ display: "flex", mt: 2 , justifyContent:"flex-end"}}>
                    <AppsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleGridView}/>
                    <TableRowsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={handleListView}/>
                </Box>

                {sideLink && (<Typography variant="body1" style={{ marginTop: '20px' }}> {sideLink} </Typography>)}
                    
                </Box>

            </Box>
        </Box>
    </div>
  )
}

export default SideBar;