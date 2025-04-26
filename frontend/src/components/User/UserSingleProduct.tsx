import { CardMedia, Typography, Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";
import { Item } from "../../services/itemService";
import CloseIcon from '@mui/icons-material/Close';
import camera from "../../images/camera.png";

interface UserSingleProductProps {
  item: Item;
  onClose: () => void;
  buttonText?: string;
  onEdit?: () => void;
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

const UserSingleProduct: React.FC<UserSingleProductProps> = ({ item, onClose, buttonText, onEdit }) => {
  if (!item) {
    return null;
  }

  return (
    <Modal
      open={!!item} // Open if 'item' prop exists
      onClose={onClose}
    >
      <Box sx={{ ...modalStyle, width: { xs: '90%', sm: 900 }, maxHeight: { xs: '95vh', sm: '90vh' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography id="single-product-modal-title" variant="h6" component="h2">
            {/* {item.name} Details */}
          </Typography>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box>
          <CardMedia
            component="img"
            image={item.imageUrl || camera}
            alt={item.name}
            sx={{ display: "block", margin: "0 auto", maxWidth: "400px", maxHeight: "400px", objectFit: "contain", padding: 2 }}
          />
        </Box>

        <Box sx={{ padding: 2, textAlign: "center" }}>
          <Typography variant="h4" sx={{ mb: 2 }}>{item.name}</Typography>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>{item.description}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2, flexWrap: 'wrap' }}>
            <Typography variant="body1"><strong>Quantity:</strong> {item.quantity}</Typography>
            <Typography variant="body1"><strong>Price:</strong> €{item.price}</Typography>
            <Typography variant="body1"><strong>Color:</strong> {item.color || "n/a"}</Typography>
            <Typography variant="body1"><strong>Size:</strong> {item.size || "n/a"}</Typography>
            <Typography variant="body1"><strong>Location:</strong> {item.itemLocation || "n/a"}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => { if (onEdit) onEdit(); }}>
            {buttonText || "Add to Cart"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default UserSingleProduct;