import { Paper, Table, TableContainer, TableHead, TableRow,TableCell, TableBody} from "@mui/material";

const AdminUsersList = () => {
    const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', membership:'yes' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
        { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com' },
      ];

    return (
        <div>
            <h4> User List Table</h4>
            <Paper sx={{ width: '90%' ,  margin: "10px"}}> 
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader> {/* Added stickyHeader for better UX */}
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell> {/* Added ID column */}
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Membership</TableCell>
                <TableCell>Address</TableCell> {/* Added Actions column */}
               
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.membership}</TableCell> {/* Added Address cell */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
           
        </div>
    );
};

export default AdminUsersList;