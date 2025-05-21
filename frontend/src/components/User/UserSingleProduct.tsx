import { CardMedia, Typography, Box, Button, IconButton, Modal } from "@mui/material";
import React from "react";
import { Item } from "../../services/itemService";
import CloseIcon from '@mui/icons-material/Close';
//import camera from "../../images/camera.png";

import noImage from "../../images/noImage.png";

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
  width: 500, // width of modal
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 3,
  maxHeight: '50vh',
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
    <Box sx={{ ...modalStyle, width: { xs: '80%', sm: 600 }, maxHeight: { xs: '85vh', sm: '80vh' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography id="single-product-modal-title" variant="h6" component="h2">
        {/* {item.name} Details */}
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
        <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 4 }}>
      <Box sx={{ flex: 2, textAlign: 'center' }}>
        <CardMedia
        component="img"
        image={item.imageUrl || noImage}
        alt={item.name}
        sx={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain", padding: 2 }}
        />
      </Box>

      <Box sx={{ flex: 2, padding: 2 }}>
        <Typography variant="h4" sx={{ mb: 2}}>{item.name}</Typography>
        <Typography sx={{ fontStyle: 'italic', mb: 2, fontSize: "18px" }}>{item.description}</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{fontSize: "14px"}}><strong>Quantity:</strong> {item.quantity}</Typography>
        <Typography sx={{fontSize: "14px"}}><strong>Price:</strong> €{item.price}</Typography>
        <Typography sx={{fontSize: "14px"}}><strong>Color:</strong> {item.color || "n/a"}</Typography>
        <Typography sx={{fontSize: "14px"}}><strong>Size:</strong> {item.size || "n/a"}</Typography>
        <Typography sx={{fontSize: "14px"}}><strong>Location:</strong> {item.itemLocation || "n/a"}</Typography>
        </Box>
      </Box>
      </Box>

        {/* Add to cart button needs quantity for user to select */}
      {/* <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={() => { if (onEdit) onEdit(); }}>
        {buttonText || "Add to Cart"}
        </Button>
      </Box> */}
      </Box>
    </Modal>
  );
};

export default UserSingleProduct;