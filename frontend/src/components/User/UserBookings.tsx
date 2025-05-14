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
  Stack,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import bookingService, {
  Booking,
  BookingItem,
} from "../../services/bookingService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const UserBookings: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editItems, setEditItems] = useState<BookingItem[]>([]);
  const [editStartDate, setEditStartDate] = useState<Date | null>(null);
  const [editEndDate, setEditEndDate] = useState<Date | null>(null);

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
    setEditStartDate(booking.startDate ? new Date(booking.startDate) : null);
    setEditEndDate(booking.endDate ? new Date(booking.endDate) : null);
    setEditDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "PENDING_APPROVAL":
        return "warning";
      case "APPROVED":
        return "info";
      case "RESERVED":
        return "success";
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

  // Mobile view for bookings
  const renderMobileView = () => {
    return (
      <Box sx={{ mt: 2, px: 1 }}>
        {bookings.map((booking) => (
          <Card key={booking.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="h6">Booking #{booking.id}</Typography>
                <Chip
                  label={booking.status}
                  color={getStatusColor(booking.status)}
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ mb: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Start Date:
                  </Typography>
                  <Typography variant="body2">
                    {booking.startDate
                      ? new Date(booking.startDate).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    End Date:
                  </Typography>
                  <Typography variant="body2">
                    {booking.endDate
                      ? new Date(booking.endDate).toLocaleDateString()
                      : "-"}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                Items:
              </Typography>
              {booking.items?.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    my: 0.5,
                  }}
                >
                  <Typography variant="body2">
                    {item.item?.name || "Unknown Item"}
                  </Typography>
                  <Typography variant="body2">Qty: {item.quantity}</Typography>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mt: 2,
                  gap: 1,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditBooking(booking)}
                  sx={{
                    opacity: 0.7,
                    transition: "opacity 0.3s",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteBooking(booking)}
                  sx={{
                    opacity: 0.7,
                    transition: "opacity 0.3s",
                    "&:hover": {
                      opacity: 1,
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  // Desktop table view
  const renderTableView = () => {
    return (
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
                Start Date
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                End Date
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
                  {booking.startDate
                    ? new Date(booking.startDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell>
                  {booking.endDate
                    ? new Date(booking.endDate).toLocaleDateString()
                    : "-"}
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
                    sx={{
                      mr: 1,
                      opacity: 0.8,
                      transition: "opacity 0.3s",
                      "&:hover": {
                        opacity: 1.5,
                      },
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteBooking(booking)}
                    sx={{
                      opacity: 0.7,
                      transition: "opacity 0.3s",
                      "&:hover": {
                        opacity: 1.5,
                      },
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Your Bookings
      </Typography>

      {isMobile ? renderMobileView() : renderTableView()}

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack
              direction={isMobile ? "column" : "row"}
              spacing={2}
              sx={{ mb: 3, mt: 1 }}
            >
              <DatePicker
                label="Start Date"
                value={editStartDate ? dayjs(editStartDate) : null}
                onChange={(newDate) =>
                  setEditStartDate(newDate ? newDate.toDate() : null)
                }
                slotProps={{
                  textField: { fullWidth: true, margin: "normal" },
                }}
              />
              <DatePicker
                label="End Date"
                value={editEndDate ? dayjs(editEndDate) : null}
                onChange={(newDate) =>
                  setEditEndDate(newDate ? newDate.toDate() : null)
                }
                slotProps={{
                  textField: { fullWidth: true, margin: "normal" },
                }}
              />
            </Stack>
          </LocalizationProvider>
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Items
          </Typography>
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

                // Format the dates properly before sending to the backend
                const formattedStartDate = editStartDate
                  ? dayjs(editStartDate).format("YYYY-MM-DD")
                  : undefined;

                const formattedEndDate = editEndDate
                  ? dayjs(editEndDate).format("YYYY-MM-DD")
                  : undefined;

              

                const updated = await bookingService.update(
                  selectedBooking.id,
                  {
                    items: editItems,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                  }
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
