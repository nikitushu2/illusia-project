import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useBookingCart } from "../hooks/useBookingCart";
import { useAuth } from "../context/AuthContext";

interface BookingCartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const BookingCartDrawer: React.FC<BookingCartDrawerProps> = ({
  open,
  onClose,
}) => {
  const { isLoggedIn, applicationUser } = useAuth();
  const {
    items,
    removeItem,
    checkout,
    loading: contextLoading,
    error: contextError,
  } = useBookingCart();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!open) {
      setError(null);
    }
  }, [open]);

  const handleSubmitBooking = () => {
    if (!isLoggedIn || !applicationUser) {
      setError("You must be logged in to submit a booking.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Submitting booking with user ID:", applicationUser.id);
    console.log("Items:", items);

    checkout()
      .then((response) => {
        console.log("Booking submission successful:", response);
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      })
      .catch((err) => {
        console.error("Booking submission failed:", err);
        setError(err?.message || "Failed to submit booking");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const displayError = error || contextError;

  if (!isLoggedIn) {
    return (
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box sx={{ width: 350, p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Your Booking Cart
            </Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Alert severity="warning">
            You must be logged in to use the booking cart.
          </Alert>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Your Booking Cart
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {displayError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {displayError}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Booking submitted successfully!
          </Alert>
        )}

        <Divider sx={{ mb: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Items
        </Typography>
        {items.length === 0 ? (
          <Typography variant="body2" sx={{ mb: 2 }}>
            No items in your cart.
          </Typography>
        ) : (
          <List>
            {items.map(({ item, quantity }) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={`Qty: ${quantity}`}
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            disabled={loading || contextLoading || items.length === 0}
            onClick={handleSubmitBooking}
          >
            {loading || contextLoading ? (
              <CircularProgress size={24} />
            ) : (
              "Submit Booking"
            )}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default BookingCartDrawer;
