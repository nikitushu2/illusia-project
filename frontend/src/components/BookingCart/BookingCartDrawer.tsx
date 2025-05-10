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

  console.log("Cart items in drawer:", items);

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

    setLoading(true);
    setError(null);

    try {
      // Add a startDate and endDate for the booking - use the current date and two weeks later
      const today = new Date();
      const twoWeeksLater = new Date(today);
      twoWeeksLater.setDate(today.getDate() + 14);

      // Create the booking with the correct data structure
      const bookingData = {
        startDate: today.toISOString().split("T")[0], // Format as YYYY-MM-DD
        endDate: twoWeeksLater.toISOString().split("T")[0], // Format as YYYY-MM-DD
        status: BookingStatus.PENDING_APPROVAL, // Use the enum value

        items: items.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      };

      console.log("Creating booking with data:", bookingData);

      // Call the real API to create the booking
      const createdBooking = await bookingService.create(bookingData);
      console.log("Successfully created booking:", createdBooking);

      // Show success notification
      alert("Booking created successfully! It is now pending admin approval.");

      // Clear the cart and close the drawer
      clearCart();
      onClose();

      // Navigate to the user dashboard showing the bookings tab
      navigate("/userDashboard", { state: { showBookings: true } });
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
              Booking Start Date: {startDate || "Not selected"}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Booking End Date: {endDate || "Not selected"}
            </Typography>
          </Box>

          <List sx={{ flexGrow: 1, overflow: "auto" }}>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{ py: 2 }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar alt={item.name} src={item.imageUrl || undefined} />
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
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
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
                            disabled={ item.quantity >= (item.remainingQuantity )}
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
  );
};

export default BookingCartDrawer;
