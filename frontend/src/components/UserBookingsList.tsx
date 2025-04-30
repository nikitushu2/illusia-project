import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Chip,
  CircularProgress,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ButtonGroup,
  Alert,
  Snackbar,
  TextField,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import bookingService, { Booking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { API_URL } from "../config";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// Define the structure of items that can be added to bookings
interface ItemInfo {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

interface BookingItem {
  id: number;
  bookingId: number;
  itemId: number;
  quantity: number;
  item?: ItemInfo;
}

const UserBookingsList: React.FC = () => {
  const { applicationUser } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<number | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [statusUpdateLoading, setStatusUpdateLoading] =
    useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [bookingToEdit, setBookingToEdit] = useState<Booking | null>(null);
  const [editFormData, setEditFormData] = useState({
    startDate: "",
    endDate: "",
    bookingItems: [] as Array<{
      id: number;
      bookingId: number;
      itemId: number;
      quantity: number;
      name?: string;
      imageUrl?: string;
    }>,
  });
  const [availableItems, setAvailableItems] = useState<
    Array<{
      id: number;
      name: string;
      imageUrl: string;
      price: number;
    }>
  >([]);

  // Added direct test function that doesn't rely on auth context
  const fetchTestBookings = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log("Making direct API call to fetch mock bookings");

      // Direct call to the API through the service
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:3000/api"
        }/bookings/user/1`
      );
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();

      console.log("Direct API call response:", data);
      setBookings(data);
    } catch (err: unknown) {
      console.error("Error in direct API test:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Test API call failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      console.log("Starting fetchUserBookings function");
      console.log("Current applicationUser:", applicationUser);

      // This is for debugging - use mock data even without a user
      if (!applicationUser?.id) {
        console.log("No user ID found, using fallback user ID 1");
        try {
          setLoading(true);
          console.log("Fetching bookings for fallback user ID: 1");
          const userBookings = await bookingService.getByUser(1); // Use hardcoded ID 1 for testing
          console.log("Fetched bookings for fallback user:", userBookings);
          setBookings(userBookings);
        } catch (err: unknown) {
          console.error("Error fetching bookings with fallback ID:", err);
          const errorMessage =
            err instanceof Error ? err.message : "Failed to load bookings";
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching bookings for user:", applicationUser.id);
        const userBookings = await bookingService.getByUser(applicationUser.id);
        console.log("Fetched bookings:", userBookings);
        setBookings(userBookings);
      } catch (err: unknown) {
        console.error("Error fetching bookings:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load bookings";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [applicationUser]);

  const toggleExpandBooking = (bookingId: number) => {
    setExpandedBookingId(expandedBookingId === bookingId ? null : bookingId);
  };

  const handleDeleteClick = (bookingId: number) => {
    setBookingToDelete(bookingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (bookingToDelete === null) return;

    try {
      setLoading(true);
      await bookingService.remove(bookingToDelete);
      setBookings(bookings.filter((booking) => booking.id !== bookingToDelete));
      setSuccessMessage("Booking deleted successfully");
    } catch (err: unknown) {
      console.error("Error deleting booking:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete booking";
      setError(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: number, statusId: number) => {
    try {
      setStatusUpdateLoading(true);
      const updatedBooking = await bookingService.updateStatus(
        bookingId,
        statusId
      );

      // Update the booking in the local state
      setBookings(
        bookings.map((b) => (b.id === bookingId ? updatedBooking : b))
      );

      setSuccessMessage(`Booking status updated successfully`);
    } catch (err: unknown) {
      console.error("Error updating booking status:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update booking status";
      setError(errorMessage);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage(null);
    setError(null);
  };

  const getStatusColor = (
    statusId: number
  ): "warning" | "success" | "error" | "info" | "default" => {
    switch (statusId) {
      case 1:
        return "warning"; // Pending approval
      case 2:
        return "success"; // Reserved
      case 3:
        return "error"; // Cancelled/rejected
      case 4:
        return "info"; // In progress
      case 5:
        return "default"; // Closed/completed
      default:
        return "default";
    }
  };

  const getStatusName = (statusId: number): string => {
    switch (statusId) {
      case 1:
        return "Pending approval";
      case 2:
        return "Reserved";
      case 3:
        return "Cancelled/rejected";
      case 4:
        return "In progress";
      case 5:
        return "Closed/completed";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const canCancel = (booking: Booking): boolean => {
    return booking.statusId === 1 || booking.statusId === 2; // Can cancel if pending or reserved
  };

  const canComplete = (booking: Booking): boolean => {
    return booking.statusId === 4; // Can complete if in progress
  };

  const handleEditClick = (booking: Booking) => {
    setBookingToEdit(booking);
    setEditFormData({
      startDate: booking.startDate.split("T")[0],
      endDate: booking.endDate.split("T")[0],
      bookingItems: booking.bookingItems || [],
    });
    fetchAvailableItems();
    setEditDialogOpen(true);
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = [...editFormData.bookingItems];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
    };

    setEditFormData({
      ...editFormData,
      bookingItems: updatedItems,
    });
  };

  const handleRemoveItem = (itemId: number) => {
    setEditFormData((prev) => ({
      ...prev,
      bookingItems: prev.bookingItems.filter((item) => item.itemId !== itemId),
    }));
  };

  const handleEditSubmit = async () => {
    if (!bookingToEdit) return;

    try {
      setLoading(true);

      // Update the interface to match what's used in bookingService
      interface ExtendedUpdateBookingData {
        startDate: string;
        endDate: string;
        bookingItems?: Array<{
          id?: number;
          bookingId?: number;
          itemId: number;
          quantity: number;
        }>;
      }

      const updateData: ExtendedUpdateBookingData = {
        startDate: new Date(editFormData.startDate).toISOString(),
        endDate: new Date(editFormData.endDate).toISOString(),
        bookingItems: editFormData.bookingItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          id: item.id,
          bookingId: item.bookingId,
        })),
      };

      try {
        const updatedBooking = await bookingService.update(
          bookingToEdit.id,
          updateData
        );

        // Update the booking in the local state
        setBookings(
          bookings.map((b) => (b.id === bookingToEdit.id ? updatedBooking : b))
        );

        setSuccessMessage("Booking updated successfully");
        setEditDialogOpen(false);
      } catch (error: any) {
        console.error("Error updating booking:", error);
        setError(error.message || "Failed to update booking");
      }
    } catch (err: unknown) {
      console.error("Error preparing booking update:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update booking";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = (booking: Booking): boolean => {
    return booking.statusId === 1; // Can only edit if pending approval
  };

  const fetchAvailableItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/items`);
      setAvailableItems(response.data);
    } catch (error) {
      console.error("Error fetching available items:", error);
    }
  };

  const handleAddBookingItem = () => {
    if (availableItems.length === 0) return;

    // Find the first available item not already in the booking
    const existingItemIds = new Set(
      editFormData.bookingItems.map((item) => item.itemId)
    );
    const availableItem = availableItems.find(
      (item) => !existingItemIds.has(item.id)
    );

    if (availableItem) {
      setEditFormData({
        ...editFormData,
        bookingItems: [
          ...editFormData.bookingItems,
          {
            id: 0, // This will be assigned by the backend
            bookingId: bookingToEdit?.id || 0,
            itemId: availableItem.id,
            quantity: 1,
            item: {
              id: availableItem.id,
              name: availableItem.name,
              imageUrl: availableItem.imageUrl,
              price: availableItem.price,
            },
          },
        ],
      });
    }
  };

  const handleRemoveBookingItem = (index: number) => {
    const updatedItems = [...editFormData.bookingItems];
    updatedItems.splice(index, 1);
    setEditFormData({
      ...editFormData,
      bookingItems: updatedItems,
    });
  };

  const handleItemChange = (index: number, newItemId: number) => {
    const selectedItem = availableItems.find((item) => item.id === newItemId);
    if (!selectedItem) return;

    const updatedItems = [...editFormData.bookingItems];
    updatedItems[index] = {
      ...updatedItems[index],
      itemId: newItemId,
      item: selectedItem,
    };

    setEditFormData({
      ...editFormData,
      bookingItems: updatedItems,
    });
  };

  if (bookings.length === 0 && !loading) {
    return (
      <Box sx={{ p: 2, mb: 4, border: "1px solid #ddd", borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          My Bookings
        </Typography>
        <Typography paragraph>
          No bookings found. This could be because:
        </Typography>
        <Typography component="ul">
          <li>You're not properly authenticated with a valid user ID</li>
          <li>The MSW mock service worker isn't intercepting API calls</li>
          <li>There's an error in the API request or response handling</li>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchTestBookings}
          sx={{ mt: 2 }}
        >
          Test Fetch Mock Bookings
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Error: {error}
          </Alert>
        )}
      </Box>
    );
  }

  if (loading && bookings.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          My Bookings
        </Typography>
        <Typography>You don't have any bookings yet.</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          My Bookings
        </Typography>
        <TableContainer>
          <Table aria-label="booking list">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <React.Fragment key={booking.id}>
                  <TableRow>
                    <TableCell>#{booking.id}</TableCell>
                    <TableCell>{formatDate(booking.startDate)}</TableCell>
                    <TableCell>{formatDate(booking.endDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={`Status: ${getStatusName(booking.statusId)}`}
                        color={getStatusColor(booking.statusId)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {booking.bookingItems?.length || 0} items
                    </TableCell>
                    <TableCell>
                      <ButtonGroup size="small" variant="outlined">
                        <Button
                          onClick={() => toggleExpandBooking(booking.id)}
                          endIcon={
                            expandedBookingId === booking.id ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )
                          }
                        >
                          {expandedBookingId === booking.id ? "Hide" : "View"}
                        </Button>
                        {canEdit(booking) && (
                          <Button
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(booking)}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(booking.id)}
                          disabled={booking.statusId === 5} // Can't delete completed bookings
                        >
                          Delete
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      style={{ paddingTop: 0, paddingBottom: 0 }}
                    >
                      <Collapse
                        in={expandedBookingId === booking.id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ py: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2">
                              Booking Details
                            </Typography>
                            <Box>
                              {canCancel(booking) && (
                                <Button
                                  size="small"
                                  color="error"
                                  sx={{ mr: 1 }}
                                  disabled={statusUpdateLoading}
                                  onClick={() =>
                                    handleStatusUpdate(booking.id, 3)
                                  }
                                >
                                  Cancel Booking
                                </Button>
                              )}
                              {canComplete(booking) && (
                                <Button
                                  size="small"
                                  color="success"
                                  disabled={statusUpdateLoading}
                                  onClick={() =>
                                    handleStatusUpdate(booking.id, 5)
                                  }
                                >
                                  Mark as Completed
                                </Button>
                              )}
                            </Box>
                          </Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Booking Items
                          </Typography>
                          <List dense>
                            {booking.bookingItems?.map((bookingItem) => (
                              <React.Fragment key={bookingItem.id}>
                                <ListItem>
                                  <ListItemText
                                    primary={`Item #${bookingItem.itemId}`}
                                    secondary={`Quantity: ${bookingItem.quantity}`}
                                  />
                                </ListItem>
                                <Divider component="li" />
                              </React.Fragment>
                            ))}
                          </List>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this booking? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Booking Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Booking Dates
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                name="startDate"
                value={editFormData.startDate}
                onChange={handleEditFormChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                name="endDate"
                value={editFormData.endDate}
                onChange={handleEditFormChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: editFormData.startDate }}
              />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Booking Items
            </Typography>
            {editFormData.bookingItems.length === 0 ? (
              <Typography color="text.secondary" sx={{ my: 2 }}>
                No items in this booking. Add items to proceed.
              </Typography>
            ) : (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>Image</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {editFormData.bookingItems.map((item, index) => {
                      const itemDetails =
                        item.item ||
                        availableItems.find((i) => i.id === item.itemId);
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            {itemDetails?.name || `Item #${item.itemId}`}
                          </TableCell>
                          <TableCell>
                            {itemDetails?.imageUrl && (
                              <Box
                                component="img"
                                src={itemDetails.imageUrl}
                                alt={itemDetails.name || `Item ${item.itemId}`}
                                sx={{
                                  width: 50,
                                  height: 50,
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(index, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                              >
                                -
                              </Button>
                              <Typography sx={{ mx: 1 }}>
                                {item.quantity}
                              </Typography>
                              <Button
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(index, item.quantity + 1)
                                }
                              >
                                +
                              </Button>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(item.itemId)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            color="primary"
            variant="contained"
            disabled={
              !editFormData.startDate ||
              !editFormData.endDate ||
              editFormData.bookingItems.length === 0
            }
          >
            {loading ? <CircularProgress size={24} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Notifications */}
      <Snackbar
        open={!!successMessage || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? "success" : "error"}
        >
          {successMessage || error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserBookingsList;
