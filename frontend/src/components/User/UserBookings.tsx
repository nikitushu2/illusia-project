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
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import bookingService, { Booking } from "../../services/bookingService";

const UserBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  // Fetch real bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        // Get bookings from the real API
        const fetchedBookings = await bookingService.getAll();
        console.log("Fetched bookings:", fetchedBookings);

        setBookings(fetchedBookings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setLoading(true);
      // Use the real cancel endpoint
      await bookingService.cancel(selectedBooking.id);

      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, status: "CANCELLED" }
            : booking
        )
      );
      setCancelDialogOpen(false);
      setLoading(false);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Failed to cancel booking. Please try again.");
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "APPROVED":
        return "info";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
        return "error";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box sx={{ mt: 2, p: 3 }}>
        <Typography variant="h6">You have no bookings yet</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Your Bookings
      </Typography>

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
                Status
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Items
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={booking.status}
                    color={getStatusColor(booking.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {booking.items &&
                    booking.items.map((item) => (
                      <Box
                        key={item.id}
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography variant="body2">
                          {item.quantity} x{" "}
                          {item.item?.name || `Item #${item.itemId}`}
                        </Typography>
                      </Box>
                    ))}
                </TableCell>
                <TableCell>
                  {booking.status === "PENDING" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancelBooking(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            No, Keep It
          </Button>
          <Button onClick={confirmCancelBooking} color="error" autoFocus>
            Yes, Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserBookings;
