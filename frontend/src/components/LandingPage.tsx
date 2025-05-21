import {
  Box,
  Container,
  Fade,
  // IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import HandshakeIcon from "@mui/icons-material/Handshake";

// import image1 from "../images/ssspaju1.png";
// import image2 from "../images/image2.png";
// import image3 from "../images/image3.png";
// import image4 from "../images/image4.png";

import image1 from "../images/illusia images/testImage 1.png";
import image2 from "../images/illusia images/testImage 2.png";
import image3 from "../images/illusia images/testImage 3.png";
import image4 from "../images/image4.png";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const { t } = useTranslation();
  const images = [image1, image2, image3, image4];
  const [currentImage, setCurrentImage] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % images.length);
        setFadeIn(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <Container>
        
    {/* this is what i want to do */}
    <Box display="flex" sx={{ width: "100%", height: "500px", overflow: "hidden" , marginTop: "10px", marginBottom: "50px", borderRadius: "20px", }}>

      {/* Left skewed box */}
      <Box sx={{width: "40%",height: "100%", clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%)" }}>
        <Box sx={{ padding: 4, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h4" align="center" sx={{ color: "#9c27b0" , fontStyle:"italic", padding:"15px", fontWeight:"bold"}} >
          {t("landingPage.welcomeText")}
        </Typography>
        </Box>
      </Box>

      {/* Right skewed image box */}
      <Box sx={{ width: "60%", height: "100%", clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",  overflow: "hidden" , borderRadius: "20px", }} >
        <Fade in={fadeIn} timeout={500}>
        <img src={images[currentImage]} alt="slideshow" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
        </Fade>
      </Box>
    </Box>

    <Box>
    <Typography variant="h4" align="center" sx={{ color: "#9c27b0", margin:"50px" }} >
      {t("landingPage.YourNextAdventureStartsHere")}
      </Typography>

    <Typography variant="h6" >
      {t("landingPage.description")}
    </Typography>

    <Box  sx={{  display: "flex",  justifyContent: "space-between",  marginTop: "50px",   gap: "70px", marginBottom: "100px", }}>
      <Box>
        <CalendarMonthIcon sx={{ width: "70px", height: "70px" }} color="secondary" />
          <Typography variant="h5">{t("landingPage.booking")}</Typography>
            <Typography variant="h6">{t("landingPage.bookingDescription")} </Typography>
      </Box>
      <Box>
        <TheaterComedyIcon sx={{ width: "70px", height: "70px" }} color="secondary"  />
          <Typography variant="h5">{t("landingPage.events")}</Typography>
          <Typography variant="h6">{t("landingPage.eventsDescription")}</Typography>
      </Box>
      <Box>
        <HandshakeIcon sx={{ width: "70px", height: "70px" }} color="secondary" />
        <Typography variant="h5">{t("landingPage.locations")}</Typography>
        <Typography variant="h6">{t("landingPage.locationDescription")}</Typography>
      </Box>
    </Box>

    </Box>

    </Container>
  );
}

export default LandingPage;