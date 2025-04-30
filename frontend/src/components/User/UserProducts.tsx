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
  Snackbar,
  Alert,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
import React, { useEffect, useState } from "react";
import camera from "../../images/camera.png";
import UserSingleProduct from "./UserSingleProduct";
import itemService from "../../services/itemService";
import { Item } from "../../services/itemService";
import { useBookingCart } from "../../context/BookingContext";

//import { Link } from "react-router-dom";
//import Helmet from "../../images/helmet.jpeg";

interface ItemListProps {
  categories?: { id: number; name: string }[];
}

const UserProducts: React.FC<ItemListProps> = ({ categories = [] }) => {
  const [modeDisplay, setModeDisplay] = React.useState("table"); // for table and grid view

  // fetching items from the backend
  const [items, setItems] = React.useState<Item[]>([]);

  //modal view for single product
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Item | null>(
    null
  );
  const [searchInput, setSearchInput] = useState<string>(""); // for search bar

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  // snackbar for add-to-cart feedback
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { addItem } = useBookingCart();

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

  //FETCH ALL ITEMS
  const fetchItems = async () => {
    try {
      console.log("Fetching items...");
      const data = await itemService.getAll();
      console.log("Fetched items:", data);
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
      // message.error("Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  //FILTER ITEMS BY CATEGORY
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.categoryId === parseInt(categoryFilter))
      );
    }

    //Reset to first page when filter changes
    //setPage(0);
  }, [categoryFilter, items]);

  // Log when categories change to help debugging
  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);

  //HANDLE TABLE VIEW
  const handleListView = () => {
    return (
      <TableContainer sx={{ maxHeight: 800 }}>
        <Table stickyHeader>
          {/* Added stickyHeader for better UX */}
          <TableHead>
            <TableRow>
              {/* <TableCell sx={{ backgroundColor: "primary.main", color: "white" }}>ID</TableCell>  not needed for user */}
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Image
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Description
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Size
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Color
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Item Location
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Category
              </TableCell>
              {/* <TableCell>Storage Details</TableCell> */}
              {/* <TableCell>Storage Location</TableCell> */}
              <TableCell
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => {
              const category = categories.find((c) => c.id === item.categoryId);
              return (
                <TableRow
                  key={item.id}
                  // component={Link}
                  // to={`/product/${product.id}`}
                  onClick={() => openModal(item)}
                >
                  {/* <TableCell>{item.id}</TableCell> */}
                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.description}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <img
                        src={camera} // Use the camera variable here
                        alt="No Image Available"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{item.itemLocation}</TableCell>
                  <TableCell>
                    {category
                      ? category.name
                      : item.categoryId
                      ? `Category ${item.categoryId}`
                      : "N/A"}
                  </TableCell>
                  {/* <TableCell>{item.storageLocation}</TableCell>  */}
                  {/* <TableCell>{item.storageLocation}</TableCell>  */}
                  {/* <TableCell><Button onClick={handleBooking}>Book</Button></TableCell> */}
                  <TableCell
                    sx={{ display: "flex", justifyContent: "center", p: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(item);
                        setSnackbarMessage(`${item.name} added to cart`);
                        setSnackbarOpen(true);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // HANDLE GRID VIEW
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
          {filteredItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            return (
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
                  <p style={{ margin: 0, color: "gray" }}>
                    Category:{" "}
                    {category
                      ? category.name
                      : item.categoryId
                      ? `Category ${item.categoryId}`
                      : "N/A"}
                  </p>
                </CardContent>
                <CardActions sx={{ justifyContent: "center", p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(item);
                      setSnackbarMessage(`${item.name} added to cart`);
                      setSnackbarOpen(true);
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            );
          })}
        </Paper>
      </div>
    );
  };

  //in case you want to move to a new page
  /*  const handleSingleProduct = () => {
    console.log("single product");
    navigate(<UserProducts/>); // wrong way. only strings are accecpted with navigate
  }; */

  /* const handleBooking = () => {
    console.log("Booking");
     navigate("/product/:id");
  }; */

  //HANDLE CATEGORY FILTER
  const handleByCategory = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };

  // Pagination calculations
  /* const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
 */

  // SEARCH MANUALLY TYPED ITEMS
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("searching");
    event.preventDefault();

    const searchInput = event.target.value;
    setSearchInput(searchInput);
    console.log("searchInput", searchInput);

    if (searchInput === "") {
      setFilteredItems(items);
    } else {
      const filteredItems = items.filter((item) =>
        item.description.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredItems(filteredItems);
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          marginBottom: "50px",
          marginTop: "10px",
          gap: "20px",
          paddingX: "20px",
        }}
      >
        {/* grid and list views  + search bar */}
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <TextField
            onChange={handleSearch}
            value={searchInput}
            label="search item"
            sx={{ width: "50%" }}
          ></TextField>
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

      {/* filter by category */}
      <Box sx={{ marginBottom: "20px" }}>
        <FormControl sx={{ width: 200 }}>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            value={categoryFilter}
            label="Filter by Category"
            onChange={handleByCategory}
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

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserProducts;
