import { Container, Typography, Box } from "@mui/material";
import event from "../images/event.png";
import odysseus from "../images/odysseus.png";

const Events = () => {
  return (
    <div>
      <Container>
        <Box sx={{  display: "flex",  flexDirection: "column",  alignItems: "center", marginBottom: "50px", marginTop: "50px",}}>
          <Typography>Travel to both past and future events list from Illusia</Typography>
        </Box>

          <Typography align="center" variant="h5" sx={{color:"primary.main"}}>UPCOMING</Typography>
          <Box sx={{padding: "10px", borderRadius: "5px", display: "flex", gap:"20px" , marginBottom: "50px", justifyContent: "center"}}>
            <Box sx={{ position: "relative", width: "300px", height: "250px", borderRadius: "5px", overflow: "hidden" }}>
                <img  src={event}  alt="event"  style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", padding: "10px",  textAlign: "center" }}>
                <Typography variant="subtitle1">May Hangout</Typography>
              </Box>
            </Box>
          <Box sx={{ position: "relative", width: "300px", height: "250px", borderRadius: "5px", overflow: "hidden" }}>
            <img  src={event}  alt="event"  style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            <Box
              sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", padding: "10px",  textAlign: "center" }}>
              <Typography variant="subtitle1">Next Event</Typography>
            </Box>
          </Box>
        </Box>

        <Typography align="center" variant="h5" sx={{color:"secondary.main"}}>PAST EVENTS</Typography>
          <Box sx={{ padding: "10px", borderRadius: "5px", display: "flex", gap:"20px", marginBottom: "50px", justifyContent: "center"}}>
            <Box sx={{ position: "relative", width: "300px", height: "250px", borderRadius: "5px", overflow: "hidden" }}>
                <img  src={odysseus}  alt="event"  style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
              <Box sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", padding: "10px",  textAlign: "center" }}>
                <Typography variant="subtitle1">Odysseus Larp</Typography>
              </Box>
            </Box>
          <Box sx={{ position: "relative", width: "300px", height: "250px", borderRadius: "5px", overflow: "hidden" }}>
            <img  src={event}  alt="event"  style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
            <Box
              sx={{ position: "absolute", bottom: 0, left: 0, width: "100%", backgroundColor: "rgba(0, 0, 0, 0.6)", color: "white", padding: "10px",  textAlign: "center" }}>
              <Typography variant="subtitle1">Past Event 2</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Events;