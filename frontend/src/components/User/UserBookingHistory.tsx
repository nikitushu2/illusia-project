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
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
  Divider,
} from "@mui/material";
import bookingService, { Booking } from "../../services/bookingService";
import { BookingStatus } from "../../types/booking";

const UserBookingHistory: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch completed and cancelled bookings
  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        setLoading(true);
        const fetchedBookings = await bookingService.getAll();

        // Filter to only show CLOSED and CANCELLED bookings for history
        const historyBookings = fetchedBookings.filter(
          (booking) =>
            booking.status === BookingStatus.CLOSED ||
            booking.status === BookingStatus.CANCELLED
        );

        // Sort by most recent first
        historyBookings.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setBookings(historyBookings);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching booking history:", err);
        setError("Failed to load booking history. Please try again.");
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.CLOSED:
        return "success";
      case BookingStatus.CANCELLED:
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
        <Typography variant="h6">You have no booking history yet</Typography>
      </Box>
    );
  }

  // Mobile view for booking history
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
                    Date:
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
        Booking History
      </Typography>
      {isMobile ? renderMobileView() : renderTableView()}
    </Box>
  );
};

export default UserBookingHistory;
