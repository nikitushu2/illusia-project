import { Paper, Table, TableContainer, TableHead, TableRow,TableCell, TableBody, Button, Box, Card, CardMedia, CardContent, CardActions} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
//import { useState } from "react";
import React from "react";
// import box from "../images/box.png";

const AdminProducts = () => {

  const [modeDisplay, setModeDisplay] = React.useState("table");

  const toggleDisplayMode = () => {
    setModeDisplay(prevMode => (prevMode === "table" ? "grid" : "table"));
  };

  
  // const [grid, setGrid] = useState<boolean>(false);
  // const [list, setList] = useState<boolean>(false);

  const products = [
    {
      "id": 2,
      "description": "military helmet",
      "category": "helmet",
      "model": "old",
      "size": null,
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
      "color": "light black",
      "totalStorage": 3,
      "storageDetails": "storage bag",
      "storageLocation": "shelf entrance side"
    }
  ]

  const handleListView = () => {
    return (
      
      
      <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader> {/* Added stickyHeader for better UX */}
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell> 
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Color</TableCell>
            <TableCell>Total Storage</TableCell>
            <TableCell>Storage Details</TableCell>
            <TableCell>Storage Location</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.description}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.size}</TableCell> 
              <TableCell>{product.color}</TableCell> 
              <TableCell>{product.totalStorage}</TableCell> 
              <TableCell>{product.storageDetails}</TableCell> 
              <TableCell>{product.storageLocation}</TableCell> 
              <Button>edit</Button>
              <Button>delete</Button>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    )
  }

  const handleGridView = () => {
    return (
      <div>
        <Paper sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexDirection: { xs: "column", md: "row" },  gap: 2, }}>
          {products.map((product) => (
            <Card  style={{height: "350px", width: "250px", display: "flex", flexDirection: "column", alignItems: "center", margin: "10px",}}
              key={product.id}>
                <CardMedia></CardMedia>
                <CardContent>
                  <h4>{product.description}</h4>
                  <p>{product.category}</p>
                  <p>{product.size}</p>
                  <p>{product.color}</p>
                  <p>{product.totalStorage}</p>
                  <p>{product.storageDetails}</p>
                  <p>{product.storageLocation}</p>
                </CardContent>
                <CardActions>
                  <Button>edit</Button>
                  <Button>delete</Button>
              </CardActions>
            </Card>
          ))}
        </Paper>
      </div>
    )
  }

     // grid view
    //  const handleGridView = () => {
    //   console.log("grid");
    //   setGrid(!grid);
    // };
  
    // list view
    // const handleListView = () => {
    //   console.log("list");
    //   setList(!list);
    // };

  

  return (
    <div>
      <Box>
      <h4> Admin Products</h4>

       {/* grid and list views */}
      <Box sx={{ display: "flex", marginRight:"50px", justifyContent: "flex-end", marginTop: "10px" }}>
        <AppsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={toggleDisplayMode} />
        <TableRowsIcon sx={{ fontSize: 40, color: "primary.main" }} onClick={toggleDisplayMode} />
      </Box>
      </Box>

      {modeDisplay === "table" ? handleListView() : handleGridView()}
    </div>

  )
}

export default AdminProducts;
