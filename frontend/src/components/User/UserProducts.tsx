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
  Stack,
  Pagination,
  useTheme,
  useMediaQuery,
  Typography,
  CircularProgress,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import camera from "../../images/camera.png";
import UserSingleProduct from "./UserSingleProduct";
import useItems from "../../services/itemService";
import { Item } from "../../services/itemService";

//import { Link } from "react-router-dom";
//import Helmet from "../../images/helmet.jpeg";

interface ItemListProps {
  onEdit: (item: Item) => void;
  categories?: { id: number; name: string }[];
}

const UserProducts: React.FC<ItemListProps> = ({ onEdit, categories = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // changed from sm to md (and) add px: { xs: 1, sm: 2 } to mobile view

  const itemsService = useItems();

  const [modeDisplay, setModeDisplay] = React.useState("table"); // for table and grid view

  const [isModalOpen, setIsModalOpen] = React.useState(false); //modal view for single product
  const [selectedProduct, setSelectedProduct] = React.useState<Item | null>(
    null
  );
  const [searchInput, setSearchInput] = useState<string>(""); // for search bar

  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  const [page, setPage] = useState(1);

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

  //FILTER ITEMS BY CATEGORY
  useEffect(() => {
    if (categoryFilter === "all") {
      setFilteredItems(itemsService.items);
    } else {
      setFilteredItems(
        itemsService.items.filter(
          (item) => item.categoryId === parseInt(categoryFilter)
        )
      );
    }
    //Reset to first page when filter changes
    setPage(1);
  }, [categoryFilter, itemsService.items]);

  // Log when categories change to help debugging
  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const indexOfLastItem = page * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // If loading is true, show a loading indicator
  if (itemsService.loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  //HANDLE TABLE VIEW
  const handleListView = () => {
    if (isMobile) {
      // 📱 Stacked layout for mobile
      return (
        <Box sx={{ mt: 2, px: { xs: 1, sm: 2 } }}>
          {currentItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            return (
              <Paper key={item.id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box
                    sx={{
                      minWidth: 80,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={item.imageUrl || camera}
                      alt={item.description || "No Image"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">
                      <strong>Name:</strong> {item.name}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Description:</strong> {item.description}
                    </Typography>
                    {/* <Typography variant="body2"><strong>Size:</strong> {item.size}</Typography>
                    <Typography variant="body2"><strong>Color:</strong> {item.color}</Typography> */}
                    <Typography variant="body2">
                      <strong>Quantity:</strong> {item.quantity}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {item.itemLocation}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong>{" "}
                      {category ? category.name : `Category ${item.categoryId}`}
                    </Typography>
                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/product/${item.id}`);
                        }}
                      >
                        Book
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          "& .MuiTableCell-root": {
            whiteSpace: "nowrap",
            maxWidth: "200px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "@media (max-width: 600px)": {
              padding: "8px",
              fontSize: "0.75rem",
            },
          },
          "& .MuiTableHead-root": {
            "@media (max-width: 600px)": {
              "& .MuiTableCell-root": {
                fontSize: "0.75rem",
                fontWeight: "bold",
              },
            },
          },
          "& .MuiTableRow-root": {
            "@media (max-width: 600px)": {
              "&:hover": {
                backgroundColor: "action.hover",
              },
            },
          },
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 800,
            "&::-webkit-scrollbar": {
              width: "8px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Image
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "150px",
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "200px",
                  }}
                >
                  Description
                </TableCell>
                {/* <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Size
                </TableCell> */}
                {/* <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Color
                </TableCell> */}
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "80px",
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "120px",
                  }}
                >
                  Item Location
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "100px",
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "120px",
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((item) => {
                const category = categories.find(
                  (c) => c.id === item.categoryId
                );
                return (
                  <TableRow
                    key={item.id}
                    onClick={() => openModal(item)}
                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <TableCell>
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.description}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            // "@media (max-width: 600px)": {
                            //   width: "50px",
                            //   height: "50px",
                            // },
                          }}
                        />
                      ) : (
                        <img
                          src={camera}
                          alt="No Image Available"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            // "@media (max-width: 600px)": {
                            //   width: "50px",
                            //   height: "50px",
                            // },
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    {/* <TableCell>{item.size}</TableCell>
                    <TableCell>{item.color}</TableCell> */}
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.itemLocation}</TableCell>
                    <TableCell>
                      {category
                        ? category.name
                        : item.categoryId
                        ? `Category ${item.categoryId}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/product/${item.id}`);
                        }}
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          padding: { xs: "4px 8px", sm: "6px 16px" },
                        }}
                      >
                        Book
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
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
          {currentItems.map((item) => {
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

  // SEARCH MANUALLY TYPED ITEMS
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("searching");
    event.preventDefault();

    const searchInput = event.target.value;
    setSearchInput(searchInput);
    console.log("searchInput", searchInput);

    if (searchInput === "") {
      setFilteredItems(itemsService.items);
    } else {
      const filteredItems = itemsService.items.filter((item) =>
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

      <Stack spacing={2} paddingTop={5} alignItems={"center"}>
        <Pagination
          count={Math.ceil(filteredItems.length / ITEMS_PER_PAGE)}
          onChange={(_, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default UserProducts;
