import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
//import { useState } from "react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { Link } from "react-router-dom";
//import Helmet from "../../images/helmet.jpeg";
import camera from "../../images/camera.png";
import UserSingleProduct from "./UserSingleProduct";
import itemService from "../../services/itemService";
import { Item } from "../../services/itemService";


interface ItemListProps {
  onEdit: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

const UserProducts : React.FC<ItemListProps> = ({ onEdit, categories = [] }) => {
  const [modeDisplay, setModeDisplay] = React.useState("table"); // for table and grid view

  //modal view for single product
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Item | null>(
    null
  );

  // fetching items from the backend
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(false);
  //const [products, setProducts] = React.useState([]); // for table and grid view'

   const [categoryFilter, setCategoryFilter] = useState<string>("all");
   const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  //  const [page, setPage] = useState(0);
  //  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();

  const toggleDisplayMode = () => {
    setModeDisplay((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  const openModal = (item: Item) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // const [grid, setGrid] = useState<boolean>(false);
  // const [list, setList] = useState<boolean>(false);

  //products/items manuually added
  /* const products = [
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
  ] */

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

  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.categoryId === parseInt(categoryFilter))
      );
    }
    // Reset to first page when filter changes
    // setPage(0);
  }, [categoryFilter, items]);

  // Log when categories change to help debugging
  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);



  //in case you want to move to a new page
 /*  const handleSingleProduct = () => {
    console.log("single product");
    navigate(<UserProducts/>); // wrong way. only strings are accecpted with navigate
  }; */

  /* const handleBooking = () => {
    console.log("Booking");
     navigate("/product/:id");
  }; */

  //handle list view
  const handleListView = () => {
    return (
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader>
          {" "}
          {/* Added stickyHeader for better UX */}
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
            {items.map((item) => (
              <TableRow
                key={item.id}
                // component={Link}
                // to={`/product/${product.id}`}
                onClick={() => openModal(item)}
              >
                <TableCell>{item.id}</TableCell>
                {/* <TableCell>{product.image}</TableCell> */}

                <TableCell>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.description}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>

                <TableCell>{item.description}</TableCell>
                <TableCell>{item.name}</TableCell>
                {/* <TableCell>{item.size}</TableCell>  */}
                {/* <TableCell>{item.color}</TableCell>  */}
                {/* <TableCell>{item.totalStorage}</TableCell>  */}
                {/* <TableCell>{item.storageDetails}</TableCell>  */}
                {/* <TableCell>{item.storageLocation}</TableCell>  */}
                {/* <TableCell><Button onClick={handleBooking}>Book</Button></TableCell> */}
                <TableCell>
                  <Button
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent row click when clicking the button
                      navigate(`/product/${item.id}`);
                    }}
                  >
                    Book
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // handle grid view
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
                image={item.imageUrl || camera}
                title={item.description}
              />
              <CardContent
                sx={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => openModal(item)}
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
                    navigate(`/product/${item.id}`);
                  }}
                >
                  Book
                </Button>
              </CardActions>
            </Card>
          ))}
        </Paper>
      </div>
    );
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
      setCategoryFilter(event.target.value);
    };

  // Pagination calculations
  /* const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
 */

  
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          // justifyContent: "space-between",
          // alignItems: "center",
          marginBottom: "50px",
          marginTop: "50px",
          gap: "20px",
          paddingX: "20px",
        }}
      >
        
     {/*    grid and list views  */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <TextField label="search item" sx={{ width: "50%" }}></TextField>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "20px",
            marginRight: "20px",
          }}
        >
          <AppsIcon
            sx={{ fontSize: 40, color: "primary.main", cursor: "pointer" }}
            onClick={toggleDisplayMode}
          />
          <TableRowsIcon
            sx={{ fontSize: 40, color: "primary.main", cursor: "pointer" }}
            onClick={toggleDisplayMode}
          />
        </Box>
      </Box>


      <Box>
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label="Filter by Category"
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                No categories available
              </MenuItem>
            )}
          </Select>
        </FormControl>
        </Box>

      {modeDisplay === "table" ? handleListView() : handleGridView()}

      {isModalOpen && selectedProduct && (
        <div>
          <UserSingleProduct item={selectedProduct} onClose={closeModal} />
        </div>
      )}
    </div>
  );
};

export default UserProducts;
