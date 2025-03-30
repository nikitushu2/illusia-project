import {
  Box,
  Card,
  Container,
  IconButton,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

import { ThemeContext } from "./themes/themeContext";
import { useContext, useEffect, useState } from "react";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import HandshakeIcon from '@mui/icons-material/Handshake';

import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/image3.png";
import image4 from "./images/image4.png";

const LandingPage = () => {
  
  // concerning light and dark mode
  const themeContext = useContext(ThemeContext);

  // image and text overlay
  const images = [ image1, image2, image3, image4 ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change image every 3 seconds


  return () => clearInterval(interval);
  }
  , [images.length]);
  
  

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

        {/* Image Transition */}
        <Box position="relative" width="100%" height="10%" overflow="hidden">

      <img src={images[currentImage]} alt="slideshow"  style={{width:"100%", height:"500px"}}/>

      {/* Overlaying Text */}
      <Typography
        variant="h4"
        color="white"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(104, 73, 73, 0.14)",
          padding: "10px 20px",
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        Your Next Adventure Starts Here
      </Typography>
    </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "30px",
            mt: 5,
          }}
        >
          <TextField type="text" sx={{ mb: 5 }} />
          <Typography variant="h4" align="center">
            Welcome to Illusia ry – The Heart of Immersive LARP Experiences!
          </Typography>
          <Typography>
          Step into a world of boundless imagination with Illusia ry, the creative force behind Odysseus and other unforgettable live-action role-playing (LARP) adventures. Whether you're a seasoned LARPer or new to the scene, we invite you to bring your stories to life with our expertly crafted props, set pieces, and immersive game design.
          </Typography>


          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 5,
              gap: "90px",
            }}                
          >
            <Box>
              <CalendarMonthIcon />
              <Typography variant="h6">Booking</Typography>
              <Typography variant="body1">
                Book your next event or use our porps 
              </Typography>
            </Box>
            <Box>
              <TheaterComedyIcon />
              <Typography variant="h6">Events</Typography>
              <Typography variant="body1">
                Events and games for you to join
              </Typography>
            </Box>
            <Box>
              <HandshakeIcon />
              <Typography variant="h6">Location</Typography>
              <Typography variant="body1">
                Real live events for you to join
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
