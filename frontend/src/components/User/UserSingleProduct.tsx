import { CardMedia, Typography, Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";
import { Item } from "../../services/itemService";
import CloseIcon from '@mui/icons-material/Close';

interface UserSingleProductProps {
  item: Item;
  onClose: () => void;
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const UserSingleProduct: React.FC<UserSingleProductProps> = ({ item, onClose }) => {
  if (!item) {
    return null;
  }

  return (
    <Modal
      open={!!item} // Open if 'item' prop exists
      onClose={onClose}
    >
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="single-product-modal-title" variant="h6" component="h2">
            {item.name} Details
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box>
          <CardMedia
            component="img"
            height="auto"
            image={item.imageUrl}
            alt={item.description}
            sx={{ width: "100%", objectFit: "contain", padding: 2 }}
          />
        </Box>

        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="h4">{item.name}</Typography>
          <Typography variant="body1">Description: {item.description}</Typography>
          <Typography variant="body1">Quantity: {item.quantity}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
          <Button variant="contained" color="primary">
            Book Now
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserSingleProduct;