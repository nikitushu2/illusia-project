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
  TextField,
  IconButton,
} from "@mui/material";
import bookingService, {
  Booking,
  BookingItem,
} from "../../services/bookingService";
import DeleteIcon from "@mui/icons-material/Delete";

const UserBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItems, setEditItems] = useState<BookingItem[]>([]);

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

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBooking = async () => {
    if (!selectedBooking) return;
    try {
      setLoading(true);
      await bookingService.delete(selectedBooking.id);
      setBookings((prev) => prev.filter((b) => b.id !== selectedBooking.id));
      setDeleteDialogOpen(false);
      setLoading(false);
    } catch (err) {
      console.error("Error deleting booking:", err);
      setError("Failed to delete booking. Please try again.");
      setLoading(false);
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditItems(
      booking.items?.map((i) => ({
        id: i.id,
        bookingId: booking.id,
        itemId: i.itemId,
        quantity: i.quantity,
        item: i.item,
      })) || []
    );
    setEditDialogOpen(true);
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
                Item Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Quantity
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
                  {booking.items?.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography variant="body2">
                        {item.item?.name || "Unknown Item"}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  {booking.items?.map((item) => (
                    <Box
                      key={item.id}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography variant="body2">{item.quantity}</Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleEditBooking(booking)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteBooking(booking)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteBooking} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Booking {selectedBooking?.id}</DialogTitle>
        <DialogContent>
          {editItems.map((item, idx) => (
            <Box
              key={item.id || item.itemId}
              sx={{ display: "flex", alignItems: "center", mt: 2 }}
            >
              <Typography sx={{ flexGrow: 1 }}>
                {selectedBooking?.items?.find((i) => i.id === item.id)?.item
                  ?.name || `Item #${item.itemId}`}
              </Typography>
              <TextField
                label="Quantity"
                type="number"
                size="small"
                value={item.quantity}
                onChange={(e) => {
                  const q = parseInt(e.target.value) || 0;
                  setEditItems((prev) => {
                    const copy = [...prev];
                    copy[idx] = { ...item, quantity: q };
                    return copy;
                  });
                }}
                sx={{ width: 80, mr: 1 }}
              />
              <IconButton
                color="error"
                onClick={() =>
                  setEditItems((prev) => prev.filter((_, i) => i !== idx))
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!selectedBooking) return;
              try {
                setLoading(true);
                const updated = await bookingService.update(
                  selectedBooking.id,
                  { items: editItems }
                );
                setBookings((prev) =>
                  prev.map((b) => (b.id === updated.id ? updated : b))
                );
                setEditDialogOpen(false);
              } catch (err) {
                console.error("Error updating booking:", err);
                setError("Failed to update booking. Please try again.");
              } finally {
                setLoading(false);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserBookings;
