import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, Container, CssBaseline } from "@mui/material";
import ItemManagement from "./components/Items/ItemManagement";

import LandingPage from "./components/LandingPage";
//import Sidebar from "./components/Sidebar";
import { LogoutPage } from "./components/LogoutPage";
import { Login } from "./components/login/Login";
import SignUp from "./components/SignUp";
import { Header } from "./components/Header";
import Footer from "./components/Footer";
import UserDashboard from "./components/User/UserDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/sideBar" element={<Sidebar />} /> */}
            <Route path="/logoutPage" element={<LogoutPage />} />
            <Route path="/items" element={<ItemManagement />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route path="/userDashboard" element={<UserDashboard />} />
            
          </Routes>
        </Container>
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
