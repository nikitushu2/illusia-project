import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  FormHelperText,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import itemService, { ItemWithAvailability } from "../../services/itemService";
import { useBookingCart } from "../../hooks/useBookingCart";

const ItemAvailabilitySearch: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [items, setItems] = useState<ItemWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const { addItem } = useBookingCart();

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (startDate >= endDate) {
      setError("End date must be after start date");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = startDate.toISOString();
      const formattedEndDate = endDate.toISOString();

      const availableItems = await itemService.checkAvailability(
        formattedStartDate,
        formattedEndDate
      );
      setItems(availableItems);
      setSearched(true);
    } catch (err) {
      console.error("Error searching for available items:", err);
      setError("Failed to fetch available items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: ItemWithAvailability) => {
    addItem(item, 1);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Not selected";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Check Item Availability
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Select Date Range
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                disablePast
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
              <FormHelperText>From: {formatDate(startDate)}</FormHelperText>
            </Box>

            <Box sx={{ flex: 1 }}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                disablePast
                minDate={startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
              <FormHelperText>To: {formatDate(endDate)}</FormHelperText>
            </Box>
          </Box>
        </LocalizationProvider>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={loading || !startDate || !endDate}
          sx={{ mt: 1 }}
        >
          {loading ? <CircularProgress size={24} /> : "Search Available Items"}
        </Button>
      </Box>

      {searched && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Items for {formatDate(startDate)} - {formatDate(endDate)}
          </Typography>

          {items.length === 0 ? (
            <Alert severity="info">
              No items available for the selected date range.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "primary.main" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Description
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Image
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Price
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Available Quantity
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow
                      key={item.id}
                      sx={{ opacity: item.isAvailable ? 1 : 0.5 }}
                    >
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          style={{ width: 50, height: 50, objectFit: "cover" }}
                        />
                      </TableCell>
                      <TableCell>
                        €
                        {typeof item.price === "string"
                          ? parseFloat(item.price).toFixed(2)
                          : item.price.toFixed(2)}
                      </TableCell>
                      <TableCell>{item.availableQuantity}</TableCell>
                      <TableCell>{item.itemLocation}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          disabled={!item.isAvailable}
                          onClick={() => handleAddToCart(item)}
                        >
                          Add to Cart
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ItemAvailabilitySearch;
