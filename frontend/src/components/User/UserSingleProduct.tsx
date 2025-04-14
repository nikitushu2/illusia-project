import { CardMedia, Card, Typography, Box, Button } from "@mui/material";

interface Product {
  name: string;
  description: string;
  category: string;
  image: string;
}

interface UserSingleProductProps {
  product: Product | null;
  onClose: () => void;
}

const UserSingleProduct: React.FC<UserSingleProductProps> = ({ product, onClose }) => {

  if (!product) {
    return null;
  }
 
  return (
    <div >
        <p>Show single product details here</p>

        <Card 
          onClick={onClose} 
          // style={{height: "600px", width: "200px", display: "flex", flexDirection: "column", alignItems: "center", margin: "10px",}}>
           style={{position:'absolute',top:'50%', left:'50%', transform: 'translate(-50%, -50%)', width: 900, background:'#fff', border: '2px solid #000',}}
          >
        <Box>
            <CardMedia  component="img" height="140" image="../images/box.svg" alt="Image" sx={{width:"20px", objectFit: "contain" }}/>
        </Box>
       

        <Box sx={{ padding: 2, textAlign: "center" }}>
            <Typography variant="h4">Product Name</Typography>
            <Typography variant="body1">Product Description</Typography>
            <Typography variant="body1">Product Category</Typography>
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