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
import { Item } from "../../services/itemService";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

import { ApiRole, useFetch } from "../../hooks/useFetch";

interface ItemListProps {
  categories?: { id: number; name: string }[];
}

const UserProducts: React.FC<ItemListProps> = ({ categories = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [modeDisplay, setModeDisplay] = useState("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const {
    data: items,
    loading: isLoading,
    apiError,
    get,
  } = useFetch<Item[]>(ApiRole.PUBLIC);

  // Fetch items on component mount
  useEffect(() => {
    get("items");
  }, [get]);

  // Update filtered items when items change
  useEffect(() => {
    if (items) {
      setFilteredItems([...items]);
    }
  }, [items]);

  // Handle category filtering
  useEffect(() => {
    if (!items) return;

    const newFilteredItems =
      categoryFilter === "all"
        ? [...items]
        : items.filter((item) => item.categoryId === parseInt(categoryFilter));

    setFilteredItems(newFilteredItems);
  }, [categoryFilter, items]);

  // Search availability based on dates
   const searchAvailability = async () => {
    if (startDate && endDate) {
      try {
        const response = await get(
          `items/availability?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
        );
        if (response) {
          setFilteredItems(response);
          setPage(1);
        }
      } catch (error) {
        console.error("Error searching availability:", error);
      }
    }
  }; 

  // Handle search input
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.trim().toLowerCase();
    setSearchInput(searchTerm);

    if (!items) return;

    if (searchTerm === "") {
      setFilteredItems([...items]);
      return;
    }

    const newFilteredItems = items.filter((item) => {
      const itemName = (item.name || "").toLowerCase();
      const itemDescription = (item.description || "").toLowerCase();
      return (
        itemName.includes(searchTerm) || itemDescription.includes(searchTerm)
      );
    });

    setFilteredItems(newFilteredItems);
  };

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

  // Log when categories change to help debugging
  useEffect(() => {
    console.log("Categories in ItemList:", categories);
  }, [categories]);

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const indexOfLastItem = page * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Show loading state
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (apiError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography color="error">
          Error loading items. Please try again later.
        </Typography>
      </Box>
    );
  }

  //HANDLE TABLE VIEW
  const handleListView = () => {
    if (isMobile) {
      // Mobile view for smaller screens
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

    //regular table view for larger screens
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
          {currentItems.length > 0 ? (
            currentItems.map((item) => {
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
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              );
            })
          ) : (
            <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
              No available items found for the selected dates
            </Box>
          )}
        </Paper>
      </div>
    );
  };

  //HANDLE CATEGORY FILTER
  const handleByCategory = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
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

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* filter by category */}
        <Box>
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="category-filter-label">
              Filter by Category
            </InputLabel>
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

        {/* Date Range Pickers */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ width: 200 }}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ width: 200 }}
            />
            <Button
              onClick={searchAvailability}
              disabled={!startDate || !endDate || isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </LocalizationProvider>
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
