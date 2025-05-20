import React, { useState } from "react";
import {
  Drawer,
  Typography,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useBookingCart, CartItem } from "../../context/BookingCartContext";
import { useNavigate } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { BookingStatus } from "../../types/booking";

interface BookingCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const BookingCartDrawer: React.FC<BookingCartDrawerProps> = ({
  open,
  onClose,
}) => {
  const { items, removeItem, updateQuantity, clearCart, startDate, endDate } =
    useBookingCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSnackbar, setSuccessSnackbar] = useState(false);

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    console.log(
      "Changing quantity for item:",
      item.id,
      "from",
      item.quantity,
      "to",
      newQuantity
    );
    updateQuantity(item.id, newQuantity);
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select booking dates first");
      return;
    }

    // Basic validation
    if (new Date(startDate) > new Date(endDate)) {
      setError("Start date must be before end date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create the booking with the correct data structure with dates in YYYY-MM-DD format
      const bookingData = {
        startDate: startDate,
        endDate: endDate,
        status: BookingStatus.PENDING_APPROVAL,

        items: items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      };

      // Call the real API to create the booking
      await bookingService.create(bookingData);

      // Show success notification with Snackbar instead of alert
      setSuccessSnackbar(true);

      // Clear the cart and close the drawer
      clearCart();
      onClose();

      // Add a slight delay before navigating to ensure the success message is visible
      setTimeout(() => {
        // Navigate to the user bookings page directly to avoid potential routing issues
        navigate("/userBookings");
      }, 1500);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((total, item) => {
    const price =
      typeof item.price === "string" ? parseFloat(item.price) : item.price;
    return total + price * item.quantity;
  }, 0);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 400 }, padding: 2 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Your Cart
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body1">Your cart is empty</Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Booking Start Date:{" "}
                {startDate ? (
                  new Date(startDate).toLocaleDateString()
                ) : (
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => {
                      onClose();
                      navigate("/");
                    }}
                  >
                    Select Dates
                  </Button>
                )}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Booking End Date:{" "}
                {endDate
                  ? new Date(endDate).toLocaleDateString()
                  : "Not selected"}
              </Typography>
            </Box>

            <List sx={{ flexGrow: 1, overflow: "auto" }}>
              {items.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{ py: 2 }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={item.name}
                        src={item.imageUrl || undefined}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" component="span">
                            €
                            {typeof item.price === "string"
                              ? parseFloat(item.price).toFixed(2)
                              : item.price.toFixed(2)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                handleQuantityChange(
                                  item,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              sx={{
                                minWidth: "24px",
                                width: "24px",
                                height: "24px",
                                p: 0,
                                fontSize: "14px",
                              }}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Typography sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                handleQuantityChange(item, item.quantity + 1)
                              }
                              sx={{
                                minWidth: "24px",
                                width: "24px",
                                height: "24px",
                                p: 0,
                                fontSize: "14px",
                              }}
                              disabled={
                                item.quantity >=
                                (item.remainingQuantity || item.quantity)
                              }
                            >
                              +
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>

            <Box sx={{ mt: 3, p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Subtotal: €{subtotal.toFixed(2)}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={clearCart}
                  disabled={loading}
                  fullWidth
                >
                  Clear Cart
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading || items.length === 0}
                  fullWidth
                  sx={{ backgroundColor: "#3ec3ba" }}
                >
                  {loading ? <CircularProgress size={24} /> : "Book Now"}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Drawer>

      <Snackbar
        open={successSnackbar}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          maxWidth: "80%",
          top: 16,
        }}
      >
        <Alert
          onClose={() => setSuccessSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{
            width: "100%",
            padding: "6px 12px",
          }}
          style={{
            backgroundColor: "#1b5e20", // Darker green
          }}
        >
          <Typography fontSize="0.875rem" color="white" fontWeight={500}>
            Your booking has been successfully created, now pending approval
            from admin.
          </Typography>
        </Alert>
      </Snackbar>
    </>
  );
};

export default BookingCartDrawer;
