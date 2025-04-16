import { Box, Button, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom";


export const LogoutPage = () => {
    const navigate = useNavigate();

    const backToLogin = () => {
        navigate("/login");
    }

    const backToHome = () => {
        navigate("/");
    }
  return (
    <Box>
        <Typography variant="h4" sx={{ textAlign: "center", marginTop: 5 }}>
            You have been logged out.
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", marginTop: 2 }}>
            Thank you for using our application!
        </Typography>
        <Box sx={{ textAlign: "center", marginTop: 3 }}>
            <Button
            variant="contained"
            color="primary"
            onClick={backToLogin}
            sx={{ marginRight: 2 }}
            >
            Go to Login
            </Button>
            <Button
            variant="contained"
            color="primary"
            onClick={backToHome}
            >
            Home
            </Button>
        </Box>
    </Box>
  )
}

