import React from "react";
import { Badge, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useBookingCart } from "../context/BookingCartContext";

interface ShoppingCartIconProps {
  color?: string;
}

const ShoppingCartIconComponent: React.FC<ShoppingCartIconProps> = ({
  color = "#44195b",
}) => {
  const { totalItems, openCart } = useBookingCart();

  return (
    <IconButton color="inherit" onClick={openCart} sx={{ color }}>
      <Badge badgeContent={totalItems} color="error">
        <ShoppingCartIcon fontSize="large" />
      </Badge>
    </IconButton>
  );
};

export default ShoppingCartIconComponent;
