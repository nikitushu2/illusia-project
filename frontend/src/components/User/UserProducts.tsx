import { Paper, Table, TableContainer, TableHead, TableRow,TableCell, TableBody, Button, Box, Card, CardMedia, CardContent, CardActions} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
//import { useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Helmet from "../../images/helmet.jpeg";
import camera from "../../images/camera.png";
import UserSingleProduct from "./UserSingleProduct";


const UserProducts = () => {

  const [modeDisplay, setModeDisplay] = React.useState("table"); // for table and grid view

  //modal view for single product
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState(null);


  const navigate = useNavigate();

  const toggleDisplayMode = () => {
    setModeDisplay(prevMode => (prevMode === "table" ? "grid" : "table"));
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };
  
  // const [grid, setGrid] = useState<boolean>(false);
  // const [list, setList] = useState<boolean>(false);

  //products/items
  const products = [
    {
      "id": 2,
      "description": "military helmet",
      "category": "helmet",
      "model": "old",
      "size": null,
      "image": Helmet,
      "color": "black",
      "totalStorage": 6,
      "storageDetails": "storage bag",
      "storageLocation": "shelf entrance side"
    },
    {
      "id": 5,
      "description": "combat vest",
      "category": "vest",
      "model": "new with EL strips",
      "size": null,
      "image": Helmet,
      "color": "black",
      "totalStorage": 5,
      "storageDetails": "storage bag",
      "storageLocation": "shelf entrance side"
    },
     {
      "id": 6,
      "description": "combat vest",
      "category": "vest",
      "model": "old",
      "size": null,
      "image": null,
      "color": "black",
      "totalStorage": 5,
      "storageDetails": "storage bag",
      "storageLocation": "shelf entrance side"
    },
    {
      "id": 7,
      "description": "combat vest",
      "category": "vest",
      "model": "old",
      "size": null,
      "image": null,
      "color": "light black",
      "totalStorage": 3,
      "storageDetails": "storage bag",
      "storageLocation": "shelf entrance side"
    }
  ]

  //in case you want to move to a new page
  const handleSingleProduct = () => {
    console.log("single product");
    //navigate(<UserProducts/>); // wrong way. only strings are accecpted with navigate
  }

  const handleBooking = () => {
    console.log("Booking");
    // navigate("/product/:id");
  }

  //handle list view
  const handleListView = () => {
    return (
    
      <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader> {/* Added stickyHeader for better UX */}
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell> 
            <TableCell>Image</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Total Storage</TableCell>
            <TableCell>Storage Details</TableCell>
            <TableCell>Storage Location</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow 
              key={product.id} 
              // component={Link} 
              // to={`/product/${product.id}`} 
              onClick={() => openModal(product)}
              >
              <TableCell>{product.id}</TableCell>
              {/* <TableCell>{product.image}</TableCell> */}

              <TableCell>
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.description}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                ) : (
                  "No Image"
                )}
              </TableCell>

              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.size}</TableCell> 
              <TableCell>{product.color}</TableCell> 
              <TableCell>{product.totalStorage}</TableCell> 
              <TableCell>{product.storageDetails}</TableCell> 
              <TableCell>{product.storageLocation}</TableCell> 
              {/* <TableCell><Button onClick={handleBooking}>Book</Button></TableCell> */}
              <TableCell>
                  <Button onClick={(event) => {
                    event.stopPropagation(); // Prevent row click when clicking the button
                    navigate(`/product/${product.id}`);
                  }}>Book</Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  // handle grid view
  const handleGridView = () => {
    return (
      <div>
        <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexDirection: { xs: "column", md: "row" },  gap: 2, }}>
          {products.map((product) => (
            <Card  style={{height: "600px", width: "200px", display: "flex", flexDirection: "column", alignItems: "center", margin: "10px",}}
              key={product.id}>
                <CardMedia  sx={{ height: 200, width: "100%" }} image={product.image || camera} />
                <CardContent onClick={() => openModal(product)}>
                  {/* <Link to="/product/:id"> */} 
                  <p>{product.description}</p>
                  <p>{product.category}</p>
                  <p>{product.size}</p>
                  <p>{product.color}</p>
                  <p>{product.totalStorage}</p>
                  <p>{product.storageDetails}</p>
                  <p>{product.storageLocation}</p>
                  {/* </Link> */}
                </CardContent>
                
                
                <CardActions>
                  <Button onClick={handleBooking}>Book</Button>
                
              </CardActions>
            </Card>
          ))}
        </Paper>
      </div>
    )
  }

    return (
    <div>
      <Box>
        {/* grid and list views */}
        <Box sx={{ display: "flex", marginRight:"50px", justifyContent: "flex-end", marginTop: "10px" }}>
          <AppsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={toggleDisplayMode} />
          <TableRowsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={toggleDisplayMode} />
        </Box>
      </Box>

      {modeDisplay === "table" ? handleListView() : handleGridView()}

      {isModalOpen && (
        <div 
        // style={{position:'absolute',top:'50%', left:'50%', transform: 'translate(-50%, -50%)', width: 900, background:'#fff', border: '2px solid #000',}}
        onClick={closeModal}>
          <UserSingleProduct product={selectedProduct} onClose={closeModal} />
        </div>
      )}
    </div>

  )
}

export default UserProducts;
