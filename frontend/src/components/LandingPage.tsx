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

import image1 from "../images/ssspaju1.png";
import image2 from "../images/image2.png";
import image3 from "../images/image3.png";
import image4 from "../images/image4.png";

// const LandingPage = () => {
  // image and text overlay
  // const images = [image1, image2, image3, image4];
  // const [currentImage, setCurrentImage] = useState(0);
  // const [fadeIn, setFadeIn] = useState(true);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setFadeIn(false);
  //     setTimeout(() => {
  //       setCurrentImage((prev) => (prev + 1) % images.length);
  //       setFadeIn(true);
  //     }, 500);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [images.length]);

//   // commentented out
//   // rating read only
//   //const [value, setvalue] = useState<number []>([4,5]);

//   return (
//     <div>
//       <Container>
//         {/* Image Transition */}
//         <Box position="relative" width="100%" height="10%" overflow="hidden">
//           <Fade in={fadeIn} timeout={500}>
//             <img
//               src={images[currentImage]}
//               alt="slideshow"
//               style={{ width: "100%", height: "500px" }}
//             />
//           </Fade>

//           {/* Overlaying Text */}
//           <Typography
//             variant="h4"
//             color="white"
//             sx={{
//               position: "absolute",
//               top: "50%",
//               left: "50%",
//               transform: "translate(-50%, -50%)",
//               bgcolor: "rgba(104, 73, 73, 0.14)",
//               padding: "10px 20px",
//               borderRadius: 2,
//               textAlign: "center",
//             }}
//           >
//             Your Next Adventure Starts Here
//           </Typography>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "30px",
//             mt: 5,
//           }}
//         >
//           <Box>
//             <Typography variant="h4" align="center" sx={{ color: "#9c27b0" }}>
//               Welcome to Illusia ry – The Heart of Immersive LARP Experiences!
//             </Typography>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "50px",
//                 marginTop: "0px",
//               }}
//             >
//               <img
//                 src={image1}
//                 alt="illusia-logo"
//                 style={{
//                   height: "500px",
//                   maxWidth: "600px",
//                   objectFit: "contain",
//                 }}
//               />
//               <Typography variant="h6">
//                 Step into a world of boundless imagination with Illusia Ry, the
//                 creative force behind Odysseus and other unforgettable
//                 live-action role-playing (LARP) adventures. Whether you're a
//                 seasoned LARPer or new to the scene, we invite you to bring your
//                 stories to life with our expertly crafted props, set pieces, and
//                 immersive game design.
//               </Typography>
//             </Box>
//           </Box>
//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               marginTop: "0px",
//               gap: "70px",
//             }}
//           >
//             <Box>
//               <CalendarMonthIcon sx={{ width: "70px", height: "70px" }} />
//               <Typography variant="h5" color="secondary">
//                 Booking
//               </Typography>
//               <Typography variant="h6">
//                 Book your next event or use our porps
//               </Typography>
//             </Box>
//             <Box>
//               <TheaterComedyIcon sx={{ width: "70px", height: "70px" }} />
//               <Typography variant="h5">Events</Typography>
//               <Typography variant="h6">
//                 Events and games for you to join
//               </Typography>
//             </Box>
//             <Box>
//               <HandshakeIcon sx={{ width: "70px", height: "70px" }} />
//               <Typography variant="h5">Location</Typography>
//               <Typography variant="h6">
//                 Real live events for you to join
//               </Typography>
//             </Box>
//           </Box>
//         </Box>

//         {/* user reviews */}
//         <Typography variant="h5" sx={{ mt: 10 }} align="center">
//           USER REVIEWS
//         </Typography>
//         <Box sx={{ mt: 2 }} display={"flex"} justifyContent={"space-between"}>
//           <Card sx={{ width: 300, p: 2, mb: 2 }}>
//             <Typography variant="h6">Review 1</Typography>
//             <Typography variant="body1">
//               This is a review of Illusia{" "}
//             </Typography>
//             <Rating name="read-only" value={4} readOnly />
//           </Card>

//           <Card sx={{ width: 300, p: 2, mb: 2 }}>
//             <Typography variant="h6">Review 2</Typography>
//             <Typography variant="body1">
//               This is a review of Illusia{" "}
//             </Typography>
//             <Rating name="read-only" value={5} readOnly />
//           </Card>

//           <Card sx={{ width: 300, p: 2, mb: 2 }}>
//             <Typography variant="h6">Review 3</Typography>
//             <Typography variant="body1">
//               This is a review of Illusia{" "}
//             </Typography>
//             <Rating name="read-only" value={4} readOnly />
//           </Card>
//         </Box>
//       </Container>
//     </div>
//   );
// };

// export default LandingPage;


// Version 2
const LandingPage = () => {

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
        <Typography variant="h4" align="center" sx={{ color: "#9c27b0" , fontStyle:"italic"}}>
          Welcome to Illusia ry – The Heart of Immersive LARP Experiences!
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
    <Typography variant="h4" align="center" sx={{ color: "#9c27b0", margin:"50px" }} > Your next adventure starts here</Typography>

    <Typography variant="h6" >
    Step into a world of imagination with Illusia Ry, the creative team behind Odysseus and other memorable live-action role-playing (LARP) adventures. Whether you're experienced or just starting out, you can bring your stories to life with our detailed props, sets, and engaging game design.
    </Typography>

    <Box  sx={{  display: "flex",  justifyContent: "space-between",  marginTop: "50px",   gap: "70px", marginBottom: "100px", }}>
      <Box>
        <CalendarMonthIcon sx={{ width: "70px", height: "70px" }} color="secondary" />
          <Typography variant="h5">Booking</Typography>
            <Typography variant="h6">Book your next event or use our porps </Typography>
      </Box>
      <Box>
        <TheaterComedyIcon sx={{ width: "70px", height: "70px" }} color="secondary"  />
          <Typography variant="h5">Events</Typography>
          <Typography variant="h6">Events and games for you to join </Typography>
      </Box>
      <Box>
        <HandshakeIcon sx={{ width: "70px", height: "70px" }} color="secondary" />
        <Typography variant="h5">Location</Typography>
        <Typography variant="h6">  Real live events for you to join</Typography>
      </Box>
    </Box>

    </Box>

    </Container>
  );
}

export default LandingPage;