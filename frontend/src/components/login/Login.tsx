import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Google as GoogleIcon } from "@mui/icons-material";

export const Login = () => {
  const handleGoogleLogin = () => {
    // TODO: Integrate with Firebase or OAuth provider
    console.log("Google login clicked");
  };

  return (
    <Box sx={{ margin: "auto", textAlign: "center", maxWidth: 600, px: 2 }}>
      <Box sx={{ paddingTop: 10, mb: 4 }}>
        <Typography variant="h3">Welcome!</Typography>
        <Typography variant="subtitle1">Log in to your account.</Typography>
      </Box>

      <Box>
        <TextField
          fullWidth
          label="Username/Email"
          variant="outlined"
          sx={{ mb: 2, maxWidth: 500 }}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ mb: 2, maxWidth: 500 }}
        />
      </Box>

      <Box textAlign="right" sx={{ maxWidth: 500, mx: "auto", mb: 2 }}>
        <Button
          component={Link}
          to="/forgot-password"
          sx={{ textTransform: "none", fontSize: "0.9rem" }}
        >
          Forgot Password?
        </Button>
      </Box>

      <Box>
        <Button variant="contained" sx={{ padding: 1, width: 200, mb: 2 }}>
          Login
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          my: 2,
          maxWidth: 500,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            height: "1px",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />
        <Typography sx={{ px: 2 }}>or</Typography>
        <Box
          sx={{
            flexGrow: 1,
            height: "1px",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        />
      </Box>

      <Box>
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          sx={{
            textTransform: "none",
            color: "black",
            border: "1px solid orange",
            padding: 1,
            width: 250,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginLeft: "auto",
            marginRight: "auto",
            textAlign: "center",
          }}
        >
          <GoogleIcon />
          Login with Google
        </Button>
      </Box>

      <Box>
        <Typography>
          Don't have an account?{" "}
          <Button
            component={Link}
            to="/signup"
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Sign Up
          </Button>
        </Typography>
      </Box>

      <Box>
        <Button
          component={Link}
          to="/admin-login"
          sx={{ padding: 1, textTransform: "none" }}
        >
          Admin Login here
        </Button>
      </Box>
    </Box>
  );
};
