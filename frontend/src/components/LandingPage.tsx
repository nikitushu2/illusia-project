import {
  Box,
  Button,
  Card,
  Container,
  // IconButton,
  Rating,
  Typography,
} from "@mui/material";
import {  useEffect, useState } from "react";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import HandshakeIcon from '@mui/icons-material/Handshake';

import image1 from "../images/ssspaju1.png";
import image2 from "../images/image2.png";
import image3 from "../images/image3.png";
import image4 from "../images/amikoiranen.png";
import image5 from "../images/image1.png";


const LandingPage = () => {
  
  // image and text overlay
  const images = [ image1, image2, image3, image4 ];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); 


  return () => clearInterval(interval);
  }
  , [images.length]);


  // rating read only
  //const [value, setvalue] = useState<number []>([4,5]);


  return (
    <div>
      <Container>

        {/* Image Transition */}
      <Box position="relative" width="100%" height="10%" overflow="hidden" >

      <Typography variant="h4" align="center" sx={{ color: "#9c27b0" , marginTop: '40px', marginBottom: '20px'}}>
            Welcome to Illusia ry – The Heart of Immersive LARP Experiences!
      </Typography>

        
      <Box sx={{ position: 'relative', width: '100%', height: '500px' }}>
      <img src={images[currentImage]} alt="slideshow"  style={{width:"100%", height:"600px"}}/>

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

        {/* Overlaying Button */}
          <Button
            variant="contained"
            color="inherit"
            sx={{
              position: 'absolute',
              bottom: '150px', // from bottom-> up
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1, // Ensure it's above the image and text
            }}
          >
            <Typography variant="body1">LOG IN / SIGN UP</Typography>
          </Button>
      </Box>
      
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
          <Box>
          

            <Box sx={{ display: "flex", alignItems: "center", gap: "50px" , marginTop: '0px'}}>
              <img src={image5} alt="illusia-logo"  style={{ height: "300px", maxWidth: "700px", objectFit: "contain" }} />
              <Typography variant="h6" justifyContent={"center"} align="center">
              Step into a world of boundless imagination with Illusia Ry, the creative force behind Odysseus and other unforgettable live-action role-playing (LARP) adventures. Whether you're a seasoned LARPer or new to the scene, we invite you to bring your stories to life with our expertly crafted props, set pieces, and immersive game design.
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: '10px',
              gap: "70px",
            }}                
          >
            <Box>
              <CalendarMonthIcon sx={{width:"70px", height:"70px"}} />
              <Typography variant="h5" color="secondary" >Booking</Typography>
              <Typography variant="h6">
                Book your next event or use our props 
              </Typography>
            </Box>
            <Box>
              <TheaterComedyIcon sx={{width:"70px", height:"70px"}}/>
              <Typography variant="h5" color="primary">Events</Typography>
              <Typography variant="h6">
                Events and games for you to join
              </Typography>
            </Box>
            <Box>
              <HandshakeIcon sx={{width:"70px", height:"70px"}}/>
              <Typography variant="h5" color="secondary">Location</Typography>
              <Typography variant="h6">
                Real live events for you to join
              </Typography>
              </Box>
          </Box>
        </Box>

        {/* user reviews */}
        <Typography variant="h5" sx={{ mt: 10 }} align="center" color="primary">User Reviews</Typography>
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
