import { Box, Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useAuth } from "../../context/AuthContext";

export const Login = () => {
  const { login } = useAuth();

  return (
    <Box sx={{ margin: "auto", textAlign: "center", maxWidth: 600, px: 2 }}>
      <Box sx={{ paddingTop: 2, mb: 6 }}>
        <Typography variant="h3" sx={{color: "primary.main"}}>WELCOME TO ILLUSIA RY</Typography>
        <Typography sx={{fontStyle:"italic"}} >Sign up/Log in to place orders</Typography>
      </Box>

      <Box>
        <Button
          onClick={login}
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
            fontSize: "1.2rem",
          }}
        >
          <GoogleIcon />
          Login with Google
        </Button>
      </Box>
    </Box>
  );
};