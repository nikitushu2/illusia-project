import { Container, Typography, Box } from "@mui/material";

const Events = () => {
  return (
    <div>
    <Container sx={{ marginTop: "20px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px" , marginTop: "50px"}}>
        <Typography variant="h3">EVENTS</Typography>
        <Typography>Travel to both past and future events list from Illusia</Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "50% 50%", gap: 2, margin: "10px" }}>

        <Box sx={{ border: "1px solid black", padding: "10px", borderRadius: "5px"}}>
          <Typography align="center" variant="h5">Upcoming</Typography>
          <Typography align="center">Future event 1</Typography>
          <Typography align="center">Future event 2</Typography>
        </Box>

        <Box sx={{ border: "1px solid black", padding: "10px", borderRadius: "5px" }}>
          <Typography align="center" variant="h5">Past</Typography>
          <Typography align="center">https://www.odysseuslarp.com/</Typography>
          <Typography align="center">Past event</Typography>
        </Box>
      </Box>

    </Container>
    </div>
  )
}

export default Events;
