import { Box, Button, Card, CardContent, Container, TextField, Typography } from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

export const Contact = () => {

  return (
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px", marginTop: "50px" }}>
      <Typography>Contact us page</Typography>
      <Typography><strong>For any inquiries, please reach out to us</strong></Typography>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px", marginTop: "50px", width: 500 }} gap={2}>
        <TextField id="name" label="Name" variant="outlined" fullWidth />
        <TextField id="email" label="Email" variant="outlined" fullWidth />
        <TextField id="message" label="Message" variant="outlined" multiline rows={4} fullWidth />
        <Button id="submit" label="Submit" type="submit" color="inherit" variant="contained" sx={{ fontSize: "1rem", fontWeight: "bold" }}> Submit</Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: 'wrap',
          alignItems: "center",
          marginBottom: "50px",
          marginTop: "50px",
          justifyContent: 'center',
          width: '100%',
          gap: 2
        }}
      >
        <Card sx={{ minWidth: '30%', flex: '1 1 auto', maxHeight: 200 }}>
          <CardContent>
            <SentimentSatisfiedAltIcon sx={{ fontSize: 50, color: '#3ec3ba' }}/>
            <Typography><strong>Email / Opening</strong></Typography>
            <Typography>Mon - Friday</Typography>
            <Typography>info@illusia.com</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: '30%', flex: '1 1 auto', maxHeight: 200 }}>
          <CardContent>
          <PhoneIcon sx={{ fontSize: 50, color: '#3ec3ba' }}/>
            <Typography><strong>Phone</strong></Typography>
            <Typography>+358 123 4567</Typography>
            <Typography>+358 123 4567</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: '30%', flex: '1 1 auto', maxHeight: 200 }}>
          <CardContent>
          <LocationOnIcon sx={{ fontSize: 50, color: '#3ec3ba' }}/>
            <Typography><strong>Location</strong></Typography>
            <Typography>Helsinki, Finland</Typography>
            <Typography>12345</Typography>
          </CardContent>
        </Card>
      </Box>


    </Container>
  )
}
