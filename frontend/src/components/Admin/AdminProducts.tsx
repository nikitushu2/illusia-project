import { Paper, Table, TableContainer, TableHead, TableRow,TableCell, TableBody, Button, Box, Card, CardMedia, CardContent, CardActions} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
//import { useState } from "react";
import React, { useEffect } from "react";
// import box from "../images/box.png";

import itemService from "../../services/itemService";
import { Item } from "../../services/itemService";

const AdminProducts = () => {

  const [modeDisplay, setModeDisplay] = React.useState("table");

  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);

  const toggleDisplayMode = () => {
    setModeDisplay(prevMode => (prevMode === "table" ? "grid" : "table"));
  };

  
  // const [grid, setGrid] = useState<boolean>(false);
  // const [list, setList] = useState<boolean>(false);

/* 
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
   */

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
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.description}</TableCell>
              {/* <TableCell>{item.category}</TableCell> */}
              {/* <TableCell>{item.size}</TableCell>  */}
              {/* <TableCell>{item.color}</TableCell>  */}
              {/* <TableCell>{item.totalStorage}</TableCell>  */}
              {/* <TableCell>{item.storageDetails}</TableCell>  */}
              {/* <TableCell>{item.storageLocation}</TableCell>  */}
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
      <Paper
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            padding: 2,
          }}
        >
          {items.map((item) => (
            <Card
              key={item.id}
              sx={{
                height: 400,
                width: 250,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <CardMedia
                sx={{ height: 200, width: "100%", objectFit: "cover" }}
                //image={item.imageUrl || camera}
                image={item.imageUrl }
                title={item.description}
              />
              <CardContent
                sx={{ textAlign: "center", cursor: "pointer" }}
                //onClick={() => openModal(item)}
              >
                <p style={{ fontWeight: "bold", margin: 0 }}>{item.name}</p>
                <p style={{ margin: 0 }}>{item.description}</p>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent row click when clicking the button
                    //navigate(`/product/${item.id}`);
                  }}
                >
                  Book
                </Button>
              </CardActions>
            </Card>
          ))}
        </Paper>
      </div>
    )
  }

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log("Fetching items...");
      const data = await itemService.getAll();
      console.log("Fetched items:", data);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      // message.error("Failed to fetch items");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
      fetchItems();
    }, []);
  


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
