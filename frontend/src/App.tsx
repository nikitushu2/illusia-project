import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import ItemManagement from "./components/Items/ItemManagement";

import LandingPage from "./components/LandingPage";
//import Sidebar from "./components/Sidebar";
import { LogoutPage } from "./components/LogoutPage";
import { Login } from "./components/login/Login";
import SignUp from "./components/SignUp";
import { Header } from "./components/Header";
import { UserManagement } from "./components/userManagement/UserManagement";
import Footer from "./components/Footer";

import UserDashboard from "./components/User/UserDashboard";
import { BookingCartProvider } from "./context/BookingCartContext";
import AdminNewProductForm from "./components/Admin/AdminNewProductForm";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Events from "./components/Events";
import Info from "./components/Info";
import Contact from "./components/Contact";
import { AuthProvider } from "./context/AuthContext";
import UserBookings from "./components/User/UserBookings";
import UserBookingHistory from "./components/User/UserBookingHistory";

const App: React.FC = () => {
  console.log("App rendering with BookingCartProvider");

  return (
    <AuthProvider>
      <BookingCartProvider>
        <Router>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              {/* <Route path="/sideBar" element={<Sidebar />} /> */}
              <Route path="/logoutPage" element={<LogoutPage />} />
              <Route path="/items" element={<ItemManagement />} />
              <Route path="/events" element={<Events />} />
              <Route path="/info" element={<Info />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              {/* TODO: show error page for /users if user is not admin, once the error page is created */}
              <Route path="/users" element={<UserManagement />} />

              {/* User Routes */}
              <Route path="/userDashboard" element={<UserDashboard />} />
              <Route path="/userBookings" element={<UserBookings />} />
              <Route
                path="/userBookingHistory"
                element={<UserBookingHistory />}
              />

              {/* Admin Routes */}
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              <Route
                path="/adminNewProduct"
                element={<AdminNewProductForm />}
              />

              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
          </Box>
        </Router>
      </BookingCartProvider>
    </AuthProvider>
  );
};

export default App;
