import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export const Login = () => {
  const { login, isLoggedIn, applicationUser, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
  
     if (isLoggedIn) {
      if (applicationUser?.role === 'admin') {
        navigate('/adminDashboard');
      } else if (applicationUser?.role === 'user') {
        navigate('/userDashboard');
      } else if (applicationUser?.role === 'superAdmin') {
        navigate('/superAdminDashboard');
      } else {
        navigate('/');
      }
    } 

   

    if (error) {
      if (error === 'User not found') {
        setLoginError('User not found. Please sign up.');
      } else if (error === 'Login failed') {
        setLoginError('Login failed. Please check your credentials or try Google login.');
      } else {
        setLoginError('An error occurred during login.');
      }
    } else {
      setLoginError(''); // Clear any previous error on successful state change
    }
  }, [isLoggedIn, navigate, applicationUser?.role, error]);

  const handleManualLogin = () => {
    // Implement your manual login logic here, using email and password
    console.log('Manual Login:', { email, password });
   navigate('/userDashboard'); // Redirect to home or dashboard after login
  };

  const googleLogin = async () => {
    try {
      setLoginError(''); // Clear any previous error before attempting login
      await login();
      // Navigation is handled by the useEffect hook
    } catch (err) {
      console.error("Google login failed:", err);
      setLoginError('Google login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ margin: "auto", textAlign: "center", maxWidth: 600, px: 2 }}>
      <Box sx={{ paddingTop: 10, mb: 4 }}>
        <Typography variant="h3">Welcome!</Typography>
        <Typography variant="subtitle1">Log in to your account.</Typography>
      </Box>

      {loginError && (
        <Typography color="error" sx={{ mb: 2 }}>{loginError}</Typography>
      )}

      {/* input fields */}
      <Box>
        <TextField
          fullWidth
          label="Username/Email"
          variant="outlined"
          sx={{ mb: 2, maxWidth: 500 }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          sx={{ mb: 2, maxWidth: 500 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>

      {/* forgot password */}
      <Box textAlign="right" sx={{ maxWidth: 500, mx: "auto", mb: 2 }}>
        <Button
          component={Link}
          to="/forgot-password"
          sx={{ textTransform: "none", fontSize: "0.9rem" }}
        >
          Forgot Password?
        </Button>
      </Box>

      {/* normal login button */}
      <Box>
        <Button
          variant="contained"
          sx={{ padding: 1, width: 200, mb: 2 }}
          onClick={handleManualLogin} // Use your manual login function here
          // disabled={!email || !password}
        >
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
          onClick={googleLogin}
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
          to="/adminDashboard" // Adjust this route as needed
          sx={{ padding: 1, textTransform: "none" }}
        >
          Admin Login here
        </Button>
      </Box>
    </Box>
  );
};