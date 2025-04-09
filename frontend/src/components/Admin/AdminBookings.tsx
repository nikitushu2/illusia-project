import { Paper, Table, TableContainer, TableHead, TableRow,TableCell, TableBody} from "@mui/material";

const AdminBookings = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com' },
      ];

    return (
        <div>
            <h4> Bookings</h4>
            <Paper sx={{ width: '90%', margin: "10px"}}> {/* Increased width for better display */}
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader> {/* Added stickyHeader for better UX */}
            <TableHead>
              <TableRow>
                <TableCell>Booking ID</TableCell> {/* Added ID column */}
                <TableCell>User</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>From</TableCell> {/* Added Actions column */}
                <TableCell>To</TableCell>
                <TableCell>Status</TableCell>
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
      </Paper>
           
        </div>
    );
};

export default AdminBookings;