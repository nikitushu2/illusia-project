import { CardMedia, Card, Typography, Box, Button } from "@mui/material";
import React from "react";
import { Item } from "../../services/itemService";

interface UserSingleProductProps {
  item: Item;
  onClose: () => void;
}

const UserSingleProduct: React.FC<UserSingleProductProps> = ({ item, onClose }) => {
  if (!item) {
    return null;
  }
 
  return (
    <div >

        <Card 
          onClick={onClose} 
          // style={{height: "600px", width: "200px", display: "flex", flexDirection: "column", alignItems: "center", margin: "10px",}}>

          // update so it is centered in the screen even when item is at the bottom of the screen
           style={{position:'absolute',top:'50%', left:'50%', transform: 'translate(-50%, -50%)', width: 900, background:'#fff', border: '2px solid #000',}}
          >

        <Box>
            {/* <CardMedia component="img" height="140" image="../images/box.svg" alt="Image" sx={{width:"20px", objectFit: "contain" }}/> */}
            <CardMedia 
              component="img" 
              height="250" 
              image={item.imageUrl} 
              alt={item.description} 
              sx={{ width: "100%", objectFit: "contain", padding: 2 }}
            />
        </Box>
       
        <Box sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h4">{item.name}</Typography>
            <Typography variant="body1">{item.description}</Typography>
            <Typography variant="body1">{item.quantity}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 2 }}>
          <Button variant="contained" color="primary" >
              Book Now
          </Button>
        </Box>

        </Card>

    </div>
  )
}

export default UserSingleProduct;