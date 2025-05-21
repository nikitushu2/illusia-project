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
  Snackbar,
  Alert,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import TableRowsIcon from "@mui/icons-material/TableRows";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import camera from "../../images/camera.png";
import UserSingleProduct from "./UserSingleProduct";
import { Item } from "../../services/itemService";
import { useBookingCart } from "../../context/BookingCartContext";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

import { ApiRole, useFetch } from "../../hooks/useFetch";
import { BookingStatus, BookingWithDetails } from "../../types/booking";
import noImage from "../../images/noImage.png";

// Add extended Item type
interface ExtendedItem extends Item {
  selectedQuantity?: number;
  remainingQuantity?: number;
  isAvailable?: boolean;
}

interface ItemListProps {
  categories?: { id: number; name: string }[];
}

const UserProducts: React.FC<ItemListProps> = ({ categories = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // navigate is used in other places in this component, or reserved for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const { addItem, setStartDate, setEndDate } = useBookingCart();

  const [modeDisplay, setModeDisplay] = useState("table");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ExtendedItem | null>(
    null
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [filteredItems, setFilteredItems] = useState<ExtendedItem[]>([]);
  const [page, setPage] = useState(1);
  const [startDate, setStartDateLocal] = useState<Dayjs | null>(null);
  const [endDate, setEndDateLocal] = useState<Dayjs | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: items,
    loading: itemsLoading,
    apiError,
    get,
  } = useFetch<Item[]>(ApiRole.PUBLIC);

  const {
    data: bookings,
    loading: bookingsLoading,
    get: getBookings,
  } = useFetch<BookingWithDetails[]>(ApiRole.PRIVATE);

  // Fetch items and bookings on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await get("items");
        await getBookings("bookings/my-bookings");
      } catch (error) {
        console.error("Error in initial data fetch:", error);
        setSnackbar({
          open: true,
          message: "Error loading initial data. Please refresh the page.",
          severity: "error",
        });
      }
    };
    fetchData();
  }, [get, getBookings]); // Remove items and bookings from dependencies

  // Update filtered items when items change
  useEffect(() => {
    if (items && items.length > 0) {
      setFilteredItems([...items]);
    }
  }, [items]);

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

  // Handle quantity selection
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setFilteredItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              selectedQuantity: Math.max(
                0,
                Math.min(newQuantity, item.remainingQuantity || item.quantity)
              ),
            }
          : item
      )
    );
  };

  // SEARCH AVAILABILITY BASED ON DATES
  const searchAvailability = async () => {
    try {
      // First validate dates
      if (!startDate || !endDate) {
        setSnackbar({
          open: true,
          message: "Please select both start and end dates",
          severity: "error",
        });
        return;
      }

      if (startDate.isAfter(endDate)) {
        setSnackbar({
          open: true,
          message: "Start date must be before end date",
          severity: "error",
        });
        return;
      }

      // Format dates consistently as YYYY-MM-DD
      const formattedStartDate = startDate.format("YYYY-MM-DD");
      const formattedEndDate = endDate.format("YYYY-MM-DD");

      // Set dates in the context
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      // Ensure we have the data before proceeding
      if (!items || !bookings) {
        setSnackbar({
          open: true,
          message: "Data not available. Please refresh the page and try again.",
          severity: "error",
        });
        return;
      }

      // Process the availability
      const activeBookings = bookings.filter((booking) => {
        const isConfirmed =
          booking.status === BookingStatus.RESERVED ||
          booking.status === BookingStatus.IN_PROGRESS ||
          booking.status === BookingStatus.PENDING_APPROVAL ||
          booking.status === BookingStatus.IN_QUEUE;
        const overlaps =
          dayjs(booking.startDate).isBefore(endDate) &&
          dayjs(booking.endDate).isAfter(startDate);
        return isConfirmed && overlaps;
      });

      const bookedQuantities: Record<number, number> = {};
      activeBookings.forEach((booking) => {
        booking.items.forEach((item) => {
          if (!bookedQuantities[item.itemId]) {
            bookedQuantities[item.itemId] = 0;
          }
          bookedQuantities[item.itemId] += item.quantity;
        });
      });

      // Update the filtered items with availability information
      const updatedFilteredItems = filteredItems.map((item) => {
        const booked = bookedQuantities[item.id] || 0;
        const remainingQuantity = item.quantity - booked; // Adjust for booked quantity only
        const isAvailable = remainingQuantity > 0;

        return {
          ...item,
          isAvailable,
          remainingQuantity,
        };
      });

      setFilteredItems(updatedFilteredItems);
      setPage(1);
      setHasSearched(true);

      // Show availability message
      const availableCount = updatedFilteredItems.filter(
        (item) => item.isAvailable
      ).length;
      const unavailableCount = updatedFilteredItems.length - availableCount;

      if (availableCount === 0) {
        setSnackbar({
          open: true,
          message: "No items available for the selected dates",
          severity: "info",
        });
      } else {
        setSnackbar({
          open: true,
          message: `${availableCount} items available, ${unavailableCount} items fully booked for the selected dates`,
          severity: "success",
        });
      }
    } catch (error) {
      console.error("Error in searchAvailability:", error);
      setSnackbar({
        open: true,
        message: "Error checking availability. Please try again.",
        severity: "error",
      });
    }
  };

  // Add snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info" | "warning";
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Handle category filtering
  useEffect(() => {
    if (!items) return;

    const newFilteredItems =
      categoryFilter === "all"
        ? [...items]
        : items.filter((item) => item.categoryId === parseInt(categoryFilter));

    setFilteredItems(newFilteredItems);
  }, [categoryFilter, items]);

  // Clear dates and reset items
  const handleClearDates = () => {
    setStartDateLocal(null);
    setEndDateLocal(null);
    setHasSearched(false);
    // Reset filtered items to show all items without availability info
    if (items) {
      setFilteredItems([...items]);
    }
  };

  const toggleDisplayMode = () => {
    setModeDisplay((prevMode) => (prevMode === "table" ? "grid" : "table"));
  };

  const openModal = (item: ExtendedItem) => {
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  // Add logging for categories
  useEffect(() => {
    console.log("Categories in UserProducts:", categories);
  }, [categories]);

  // Pagination
  const ITEMS_PER_PAGE = 12;
  const indexOfLastItem = page * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Show loading state only when items are loading
  if (itemsLoading || bookingsLoading) {
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
          Error loading items: {apiError}. Please try again later.
        </Typography>
      </Box>
    );
  }

  // If no items are available, show a message
  if (!items || items.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Typography>No items available at the moment.</Typography>
      </Box>
    );
  }

  // TABLE/LIST VIEW
  const handleListView = () => {
    if (isMobile) {
      // Mobile view for smaller screens
      return (
        <Box sx={{ mt: 2, px: { xs: 1, sm: 2 } }}>
          {currentItems.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            const isAvailable = item.isAvailable ?? true;

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
                      src={item.imageUrl || noImage}
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

                    <Typography variant="body2">
                      <strong>Quantity:</strong>{" "}
                      {hasSearched && startDate && endDate
                        ? item.remainingQuantity ?? 0
                        : item.quantity}
                    </Typography>

                    {startDate && endDate && (
                      <>
                        <Typography
                          variant="body2"
                          color={isAvailable ? "success.main" : "error.main"}
                        >
                          <strong>Status:</strong>{" "}
                          {isAvailable ? "Available" : "Fully Booked"}
                        </Typography>
                      </>
                    )}
                    <Typography variant="body2">
                      <strong>Location:</strong> {item.itemLocation}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {category ? category.name : ""}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: 1,
                        mt: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "120px",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedQuantity
                                ? item.selectedQuantity - 1
                                : 0
                            )
                          }
                          sx={{
                            minWidth: "24px",
                            width: "32px",
                            height: "32px",
                            p: 0,
                            fontSize: "14px",
                          }}
                          disabled={item.selectedQuantity === 0}
                        >
                          -
                        </Button>
                        <Typography
                          sx={{
                            width: "40px",
                            textAlign: "center",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          {item.selectedQuantity || 0}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedQuantity
                                ? item.selectedQuantity + 1
                                : 1
                            )
                          }
                          sx={{
                            minWidth: "24px",
                            width: "32px",
                            height: "32px",
                            p: 0,
                            fontSize: "14px",
                          }}
                          disabled={
                            (item.selectedQuantity ?? 0) >=
                            (item.remainingQuantity || item.quantity)
                          }
                        >
                          +
                        </Button>
                      </div>
                      <Typography
                        variant="body2"
                        sx={{
                          ml: 2,
                          color: "grey",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                        }}
                      >
                        Available: {item.remainingQuantity || item.quantity}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log(
                            "Adding item to cart from table view:",
                            item
                          );
                          addItem(item, item.selectedQuantity ?? 1);
                        }}
                        color="primary"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          "&:hover": {
                            backgroundColor: "primary.main",
                            color: "white",
                          },
                          padding: 1.5,
                        }}
                        disabled={Boolean(
                          hasSearched && startDate && endDate && !isAvailable
                        )}
                      >
                        {hasSearched && startDate && endDate && !isAvailable
                          ? "Not Available"
                          : "Add to Cart"}
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

    // Regular table view for larger screens
    return (
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <TableContainer>
          <Table>
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
                {hasSearched && startDate && endDate && (
                  <>
                    <TableCell
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        fontSize: { xs: "0.75rem", sm: "1.1rem" },
                        fontWeight: "bold",
                        minWidth: "100px",
                      }}
                    >
                      Status
                    </TableCell>
                  </>
                )}
                <TableCell
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: { xs: "0.75rem", sm: "1.1rem" },
                    fontWeight: "bold",
                    minWidth: "120px",
                  }}
                >
                  Location
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
                const isAvailable = item.isAvailable ?? true;

                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      cursor: "default", // Remove pointer cursor from the entire row
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <TableCell
                      onClick={() => openModal(item)}
                      sx={{ cursor: "pointer" }}
                    >
                      <img
                        src={item.imageUrl || noImage}
                        alt={item.description || "No Image"}
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => openModal(item)}
                      sx={{ cursor: "pointer" }}
                    >
                      {item.name}
                    </TableCell>
                    <TableCell
                      onClick={() => openModal(item)}
                      sx={{ cursor: "pointer" }}
                    >
                      {item.description}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "120px",
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.selectedQuantity
                                  ? item.selectedQuantity - 1
                                  : 0
                              )
                            }
                            sx={{
                              minWidth: "24px",
                              width: "32px",
                              height: "32px",
                              p: 0,
                              fontSize: "14px",
                            }}
                            disabled={item.selectedQuantity === 0}
                          >
                            -
                          </Button>
                          <Typography
                            sx={{
                              width: "40px",
                              textAlign: "center",
                              fontSize: "1rem",
                              fontWeight: "bold",
                            }}
                          >
                            {item.selectedQuantity || 0}
                          </Typography>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.selectedQuantity
                                  ? item.selectedQuantity + 1
                                  : 1
                              )
                            }
                            sx={{
                              minWidth: "24px",
                              width: "32px",
                              height: "32px",
                              p: 0,
                              fontSize: "14px",
                            }}
                            disabled={
                              (item.selectedQuantity ?? 0) >=
                              (item.remainingQuantity || item.quantity)
                            }
                          >
                            +
                          </Button>
                        </div>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ mt: 3, textAlign: "center", color: "grey" }}
                      >
                        {" "}
                        Available:
                        {item.remainingQuantity || item.quantity}
                      </Typography>
                    </TableCell>

                    {hasSearched && startDate && endDate && (
                      <>
                        <TableCell>
                          <Typography
                            color={isAvailable ? "success.main" : "error.main"}
                          >
                            {isAvailable ? "Available" : "Fully Booked"}
                          </Typography>
                        </TableCell>
                      </>
                    )}
                    <TableCell>{item.itemLocation}</TableCell>
                    <TableCell>{category ? category.name : ""}</TableCell>
                    <TableCell>
                      <Button
                        onClick={(event) => {
                          event.stopPropagation();
                          console.log(
                            "Adding item to cart from table view:",
                            item
                          );
                          addItem(item, item.selectedQuantity ?? 1);
                        }}
                        color="primary"
                        sx={{
                          width: { xs: "100%", sm: "auto" },
                          "&:hover": {
                            backgroundColor: "primary.main",
                            color: "white",
                          },
                          padding: 1.5,
                        }}
                        disabled={Boolean(
                          hasSearched && startDate && endDate && !isAvailable
                        )}
                      >
                        {hasSearched && startDate && endDate && !isAvailable
                          ? "Not Available"
                          : "Add to Cart"}
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const category = categories.find((c) => c.id === item.categoryId);
              const isAvailable = item.isAvailable ?? true;

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
                    sx={{
                      height: 200,
                      width: "100%",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    image={item.imageUrl || noImage}
                    title={item.description}
                    onClick={() => openModal(item)}
                  />
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography style={{ fontWeight: "bold", margin: 0 }}>
                      {item.name}
                    </Typography>
                    <Typography style={{ margin: 0 }}>
                      {item.description}
                    </Typography>
                    {/* <Typography style={{ margin: 0, color: "gray" }}>
                      Category: {category ? category.name : ""}
                    </Typography> */}
                    {hasSearched && startDate && endDate && (
                      <>
                        <Typography
                          style={{
                            margin: "8px 0",
                            color: isAvailable ? "green" : "red",
                            fontWeight: "bold",
                          }}
                        >
                          {isAvailable ? "Available" : "Fully Booked"}
                        </Typography>
                      </>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        ml: 2,
                        color: "grey",
                        fontSize: "0.9rem",
                        fontWeight: "bold",
                      }}
                    >
                      Available: {item.remainingQuantity || item.quantity}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mt: 1,
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "120px",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedQuantity
                                ? item.selectedQuantity - 1
                                : 0
                            )
                          }
                          sx={{
                            minWidth: "32px",
                            width: "32px",
                            height: "32px",
                            p: 0,
                            fontSize: "14px",
                          }}
                          disabled={item.selectedQuantity === 0}
                        >
                          -
                        </Button>
                        <Typography
                          sx={{
                            width: "40px",
                            textAlign: "center",
                            fontSize: "1rem",
                            fontWeight: "bold",
                          }}
                        >
                          {item.selectedQuantity || 0}
                        </Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.selectedQuantity
                                ? item.selectedQuantity + 1
                                : 1
                            )
                          }
                          sx={{
                            minWidth: "32px",
                            width: "32px",
                            height: "32px",
                            p: 0,
                            fontSize: "14px",
                          }}
                          disabled={
                            (item.selectedQuantity ?? 0) >=
                            (item.remainingQuantity || item.quantity)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
                        console.log(
                          "Adding item to cart from table view:",
                          item
                        );
                        addItem(item, item.selectedQuantity ?? 1);
                      }}
                      color="primary"
                      sx={{
                        width: { xs: "100%", sm: "auto" },
                        "&:hover": {
                          backgroundColor: "primary.main",
                          color: "white",
                        },
                        padding: 1.5,
                      }}
                      disabled={Boolean(
                        hasSearched && startDate && endDate && !isAvailable
                      )}
                    >
                      {hasSearched && startDate && endDate && !isAvailable
                        ? "Not Available"
                        : "Add to Cart"}
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
          flexDirection: { xs: "column", md: "column" },
          marginBottom: "50px",
          marginTop: "10px",
          gap: "20px",
          paddingX: "20px",
        }}
      >
        {/* First row: search bar and category filter */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            width: "100%",
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <TextField
              onChange={handleSearch}
              value={searchInput}
              label="search item"
              fullWidth
            />
          </Box>

          <FormControl sx={{ width: { xs: "100%", md: 200 } }}>
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

        {/* Second row: view toggle icons and date pickers */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", md: "center" },
            width: "100%",
            gap: { xs: 2, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "20px",
              justifyContent: { xs: "center", md: "flex-start" },
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

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box
              id="date-picker-section"
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDateLocal(newValue)}
                sx={{ width: { xs: "100%", sm: 200 } }}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDateLocal(newValue)}
                sx={{ width: { xs: "100%", sm: 200 } }}
              />
              <Button
                onClick={searchAvailability}
                disabled={
                  !startDate || !endDate || itemsLoading || bookingsLoading
                }
                variant="contained"
                color="primary"
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {itemsLoading || bookingsLoading ? "Loading..." : "Search"}
              </Button>
              {(startDate || endDate) && (
                <Button
                  onClick={handleClearDates}
                  variant="outlined"
                  color="primary"
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                >
                  Clear Dates
                </Button>
              )}
            </Box>
          </LocalizationProvider>
        </Box>
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

      {/* Add Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UserProducts;
