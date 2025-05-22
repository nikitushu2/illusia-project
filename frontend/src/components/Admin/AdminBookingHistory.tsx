import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useFetch, ApiRole } from "../../hooks/useFetch";
import { BookingWithDetails, BookingStatus } from "../../types/booking";
import { Item } from "../../services/itemService";

const AdminBookingHistory: React.FC = () => {
  const {
    data: bookings,
    loading: bookingsLoading,
    apiError: bookingsError,
    get: getBookings,
  } = useFetch<BookingWithDetails[]>(ApiRole.ADMIN);

  const {
    data: items,
    loading: itemsLoading,
    get: getItems,
  } = useFetch<Item[]>(ApiRole.PUBLIC);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredBookings, setFilteredBookings] = useState<
    BookingWithDetails[]
  >([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Create a map of item IDs to item objects for quick lookup
  const itemsMap = React.useMemo(() => {
    if (!items) return new Map<number, Item>();
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  useEffect(() => {
    getBookings("bookings");
    getItems("items");
  }, [getBookings, getItems]);

  // Filter bookings based on search term and status (only show closed and cancelled)
  useEffect(() => {
    if (!bookings) return;

    // Filter to only show history (CLOSED and CANCELLED bookings)
    let filtered = bookings.filter(
      (booking) =>
        booking.status === BookingStatus.CLOSED ||
        booking.status === BookingStatus.CANCELLED
    );

    // Sort by newest first
    filtered = filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply search filter if there's a search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.id.toString().includes(term) ||
          booking.user.email.toLowerCase().includes(term) ||
          booking.user.displayName.toLowerCase().includes(term) ||
          booking.status.toString().toLowerCase().includes(term)
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CLOSED:
        return "success";
      case BookingStatus.CANCELLED:
        return "error";
      default:
        return "default";
    }
  };

  // Get item name by id
  const getItemName = (itemId: number): string => {
    const item = itemsMap.get(itemId);
    return item?.name || `Item #${itemId}`;
  };

  // Pagination
  const numberOfPages = filteredBookings
    ? Math.ceil(filteredBookings.length / ITEMS_PER_PAGE)
    : 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings
    ? filteredBookings.slice(startIndex, endIndex)
    : [];

  if (bookingsLoading || itemsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (bookingsError) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">
          Failed to load booking history. Please try again.
        </Alert>
      </Box>
    );
  }

  if (filteredBookings && filteredBookings.length === 0) {
    return (
      <Box sx={{ mt: 2, p: 3 }}>
        <Typography variant="h6">No booking history found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" mb={4}>
        <b>Booking History</b> 
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          label="Search by ID, user email, or name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#44195b" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                User
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Start Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                End Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Items
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {booking.user.displayName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {booking.user.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(booking.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.items?.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2">
                        {getItemName(item.itemId)} - Qty: {item.quantity}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} paddingTop={3} alignItems="center">
        <Pagination
          count={numberOfPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </Box>
  );
};

export default AdminBookingHistory;
