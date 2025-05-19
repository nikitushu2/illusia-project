import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";

const AdminBookings = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Peter Jones", email: "peter.jones@example.com" },
  ];

  return (
    <Box sx={{ mt: 2, px: { xs: 1, sm: 2 } }}>
      <h4> Bookings</h4>
      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#44195b" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Booking ID
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                User
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Product
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                From
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                To
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminBookings;
