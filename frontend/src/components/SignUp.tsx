import { useEffect, useState } from "react";
import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Alert
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../types/applicationUser";

const BACKEND_BASE_PATH = import.meta.env.VITE_BACKEND_ORIGIN + '/api'

const GoogleSignupForm = () => {
  const { signUpUser } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [formData, setFormData] = useState({
    email: signUpUser?.email || "",
    displayName: signUpUser?.displayName || "",
    role: UserRole.USER,
  });

  useEffect(() => {
    if (signUpUser) {
      setFormData({
        email: signUpUser.email || "",
        displayName: signUpUser.displayName || "",
        role: UserRole.USER,
      });
    }
  }, [signUpUser]);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = await signUpUser?.getIdToken();

    try {
      const res = await fetch(`${BACKEND_BASE_PATH}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, token: token }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessageType("success");
        setMessage(data.message || "Signup successful!");
        setSubmitted(true);
      } else {
        setMessageType("error");
        setMessage(data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <Box sx={{ 
        maxWidth: { xs: "100%", sm: 400 }, 
        width: { xs: "90%", sm: "auto" },
        mx: "auto", 
        mt: 4,
        px: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h5" sx={{textAlign: "center"}}>{`Welcome ${formData.displayName}, kindly register!`}</Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>

            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              fullWidth
              margin="normal"
            >
              <MenuItem value={UserRole.USER}>User</MenuItem>
              <MenuItem value={UserRole.ADMIN}>Admin</MenuItem>
            </TextField>
            <Button disabled={submitted} type="submit" variant="contained" fullWidth sx={{ py: { xs: 1.5, sm: 1 }, mt: 2 }}>
              Submit
            </Button>
          </Box>
      </Box>
      {message && (
        <Alert
          severity={messageType === "success" ? "success" : "error"}
          onClose={() => setMessage(null)}
          sx={{ maxWidth: 400, mx: "auto", mt: 2 }}
        >
          {message}
        </Alert>
      )}
    </>

  );
};

export default GoogleSignupForm;
