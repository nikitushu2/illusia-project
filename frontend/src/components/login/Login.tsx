import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

import { useEffect } from "react";
import { useEffect } from "react";


export const Login = () => {
  //const { login , isLoggedIn, userRole} = useAuth();

  const navigate = useNavigate();

  //depending on the user role, navigate to the appropriate dashboard
  useEffect(() => {
    if(isLoggedIn){
      if(userRole === 'admin'){navigate('/adminDashboard')}
      else if (userRole === 'user'){navigate('/userDashboard')}
      else if (userRole === 'superAdmin'){navigate('/superAdminDashboard')}
      else {navigate('/')}
    }
  }, [isLoggedIn, navigate, userRole]);

  const googleLogin = async () => {
    try {
      await login(); 
      navigate('/adminDashboard'); 
    } 
    catch (error) {
      console.error("Google login failed:", error);
    }
  };
  const { login, isLoggedIn } = useAuth();

  const navigate = useNavigate();


  useEffect(() => {
    if(isLoggedIn){
      navigate('/userDashboard')
    }
  }, [isLoggedIn, navigate]);

  const googleLogin = async () => {
    try {
      await login(); 
      navigate('/userDashboard'); 
    } 
    catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <Box sx={{ margin: "auto", textAlign: "center", maxWidth: 600, px: 2 }}>
      <Box sx={{ paddingTop: 10, mb: 4 }}>
        <Typography variant="h3">Welcome!</Typography>
        <Typography variant="subtitle1">Log in to your account.</Typography>
      </Box>

      {/* input fields */}
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
        <Button variant="contained" sx={{ padding: 1, width: 200, mb: 2 }} component={Link} to="/userDashboard"> 
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
          //onClick={login}
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
          // to="/admin-login" // this shold take one to admin login page before the admin dashboard
          // to="/userDashboard"
          to="/adminDashboard" 
          sx={{ padding: 1, textTransform: "none" }}
        >
          Admin Login here
        </Button>
      </Box>
    </Box>
  );
};
