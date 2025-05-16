import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Container } from '@mui/material';


const Info = () =>{

  return (
    <div>
    <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "50px", marginTop: "50px" }}>
    <Typography variant="h4" sx={{ marginBottom: "20px",color:" #9537c7" }}>Info & FAQ</Typography>
      <Box sx={{ width: "100%" }}>
        <Accordion sx={{fontSize: "italic"}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Membership</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontStyle: 'italic', color:" #3ec3ba"}}>
            Simple! To be a member of Illusia Ry, just create an account with Google and the admins will approve of your booking within 1-2 days. Having a membership allows you will be able to book items and enjoy other benefits.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Items availability</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontStyle: 'italic' , color:" #3ec3ba"}}>
            All items are available for booking. You can view the items in the 'Items' section of the website. You can also view the items in your user dashboard.
            All visitors can view some section of all items in Illusia but you need to create an account with Google to book.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography component="span">Booking items</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontStyle: 'italic', color:" #3ec3ba"}}>
            Once you have an account, you can log in and book items. You can also view your booked items in your user dashboard. You can book items by choosing the period from which you would like to book the item. Add them to your cart, choose the quantity and hit Book.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Process of booking</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontStyle: 'italic',color:" #3ec3ba" }}>
            You will receive a confirmation email once your booking is confirmed otherwise it will be be moved to 'pending' waiting for the admin to approve.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Further questions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontStyle: 'italic', color:" #3ec3ba" }}>
          Contact the admins via the contact page or email admin@illusia.com
          </Typography>
        </AccordionDetails>
      </Accordion>
      </Box>
      </Container>
    </div>
  );
}

export default Info;
