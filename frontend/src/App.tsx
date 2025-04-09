import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import { Header } from "./components/Header";
import SignUp from "./components/SignUp";
import { Login } from "./components/login/Login";
import { Box } from "@mui/system";
//import SideBar from "../src/components/Sidebar";
import { Logout } from "../src/components/Logout";

import Events from "./components/Events";

import AdminNewProductForm from "./components/Admin/AdminNewProductForm";
import AdminDashboard from "./components/Admin/AdminDashboard";

function App() {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh", // Full viewport height
    }}
  >
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/sideBar" element={<SideBar />} /> */}

        <Route path="/events" element={<Events />} />

        {/* Admin Routes */}
        <Route path="/adminDashboard" element={<AdminDashboard/>} />
        <Route path="/adminNewProduct" element={<AdminNewProductForm/>} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  </Box>
 
 
  
  );
}

export default App;
