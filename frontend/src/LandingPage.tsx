import {  Box, Card, Container, TextField, Typography } from "@mui/material";
import download from "./images/download.png";

const LandingPage = () => {


  return (
    <div>
     <Container>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" , gap: "30px", mt: 5}} >
      <Card component="img" src={download} sx={{ width: "800px", height: "200px" }}/>
        <TextField type="text" label="search" sx={{mb:5}}/>
        <Typography variant="h4" align="center" >Illusia Landing Page</Typography>
        <p >Welcome to the landing page.</p>
        <p>A page where role play is possible with total immersion into the character.
          We are a community of role players who are passionate about the art of role playing.
          Come join us and experience the magic of Illusia. Also book your spot for the next event.
        </p>
      </Box>

      <Typography variant="h5" sx={{m:20}} align="center">USER REVIEWS</Typography>
        <Box sx={{ mt: 5 }} display={"flex"} justifyContent={"space-between"}>
          <Card sx={{width: 300, p: 2, mb: 2}}>
            <Typography variant="h6">Review 1</Typography>
            <Typography variant="body1">This is a review of Illusia </Typography>
          </Card>    

          <Card sx={{width: 300, p: 2, mb: 2}}>
            <Typography variant="h6">Review 2</Typography>
            <Typography variant="body1">This is a review of Illusia </Typography>
          </Card>        

          <Card sx={{width: 300, p: 2, mb: 2}}>
            <Typography variant="h6">Review 3</Typography>
            <Typography variant="body1">This is a review of Illusia </Typography>
          </Card> 

        </Box>
     </Container>
    </div>
  );
};

export default LandingPage;
