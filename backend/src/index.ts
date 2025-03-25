import express from "express";
// import dotenv from "dotenv";
// import db from "./config/db"; // Database connection file
// import cors from "cors";

// Load environment variables
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON requests
// app.use(cors()); // Enable CORS

// Sample Route
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// Database Connection Check
// db.connect()
//   .then(() => console.log("Connected to PostgreSQL Database"))
//   .catch((err) => console.error("Database connection error:", err.stack));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
