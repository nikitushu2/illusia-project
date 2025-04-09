import { Box, Button, Container, TextField, Typography } from "@mui/material";

const SignUp = () => {
  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 4,
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        <TextField label="First Name" fullWidth required variant="outlined" />
        <TextField label="Last Name" variant="outlined" fullWidth required />
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          required
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          required
        />
        <Button variant="contained" color="primary" size="large">
          Save
        </Button>
      </Box>
    </Container>
  );
};

export default SignUp;
