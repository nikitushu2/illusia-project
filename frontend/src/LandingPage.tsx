import {
  Box,
  Card,
  Container,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import download from "./images/download.png";
import { ThemeContext } from "./themes/themeContext";
import { useContext, useState } from "react";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RoomIcon from "@mui/icons-material/Room";

const LandingPage = () => {
  
  // concerning light and dark mode
  const themeContext = useContext(ThemeContext);

  // rating read only
  const [value, setvalue] = useState<number []>([4,5]);

  if (!themeContext) {
    throw new Error(
      "ThemeContext is undefined. Make sure you are using ThemeProvider."
    );
  }

  const { mode, toggleMode } = themeContext;

  return (
    <div>
      <Container>
        {/* toggleMode for light and dark mode */}

        <IconButton onClick={toggleMode} color="inherit">
          {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            mt: 5,
          }}
        >
          <Card
            component="img"
            src={download}
            sx={{ width: "800px", height: "200px" }}
            // objectFit="cover"
          />
          <TextField type="text" sx={{ mb: 5 }} />
          <Typography variant="h4" align="center">
            Illusia Landing Page
          </Typography>
          <p>Welcome to the landing page.</p>
          <p>
            A page where role play is possible with total immersion into the
            character. We are a community of role players who are passionate
            about the art of role playing. Come join us and experience the magic
            of Illusia. Also book your spot for the next event.
          </p>

          {/* what we offer */}
          <Typography variant="h5" sx={{ mt: 5 }} align="center">
          What we offer
          </Typography>
          <p>We offer bookings and further manage items for your events</p>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 5,
              gap: "90px",
            }}                
          >
            <Box>
              <TrendingUpIcon />
              <Typography variant="h6">Trending</Typography>
              <Typography variant="body1">
                Trending events and bookings
              </Typography>
            </Box>
            <Box>
              <ListAltIcon />
              <Typography variant="h6">List</Typography>
              <Typography variant="body1">
                List of events and bookings
              </Typography>
            </Box>
            <Box>
              <RoomIcon />
              <Typography variant="h6">Location</Typography>
              <Typography variant="body1">
                Location of events and bookings
              </Typography>
              </Box>
          </Box>
        </Box>

        {/* user reviews */}
        <Typography variant="h5" sx={{ mt: 10 }} align="center">
          USER REVIEWS
        </Typography>
        <Box sx={{ mt: 2 }} display={"flex"} justifyContent={"space-between"}>
          <Card sx={{ width: 300, p: 2, mb: 2 }}>
            <Typography variant="h6">Review 1</Typography>
            <Typography variant="body1">
              This is a review of Illusia{" "}
            </Typography>
            <Rating name="read-only" value={4} readOnly />
          </Card>

          <Card sx={{ width: 300, p: 2, mb: 2 }}>
            <Typography variant="h6">Review 2</Typography>
            <Typography variant="body1">
              This is a review of Illusia{" "}
            </Typography>
            <Rating name="read-only" value={5} readOnly />
          </Card>

          <Card sx={{ width: 300, p: 2, mb: 2 }}>
            <Typography variant="h6">Review 3</Typography>
            <Typography variant="body1">
              This is a review of Illusia{" "}
            </Typography>
            <Rating name="read-only" value={4} readOnly />
          </Card>
        </Box>
      </Container>
    </div>
  );
};

export default LandingPage;
