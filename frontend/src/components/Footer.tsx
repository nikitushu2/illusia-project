import { Box, Link, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        // position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        py: 2,
        textAlign: "center",
        backgroundColor: "#9c27b0",
        mt: "auto",
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Illusia RY
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 10, mt: 1 }}>
        <Link href="/contact" underline="hover">
          Contact Us
        </Link>
        <Link href="/terms" underline="hover">
          Terms & Conditions
        </Link>
        <Link href="/privacy" underline="hover">
          Privacy Policy
        </Link>
      </Box>
    </Box>
  );
}
