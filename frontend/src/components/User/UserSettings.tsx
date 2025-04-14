import { Container, Box, TextField } from "@mui/material";

const UserSettings = () => {
  return (
    <div>User settings form here
        <Container>
        <Box component={"form"} sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }} >
          <TextField label="First Name" />
          <TextField label="Last Name" />
          <TextField label="Address" />
          <TextField label="Phone number" />
        </Box>
        </Container>
    </div>
  )
}


export default UserSettings;