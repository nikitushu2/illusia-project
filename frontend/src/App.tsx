import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import LandingPage from "./components/LandingPage";
import { Header } from "./components/Header";
import SignUp from "./components/SignUp";
import { Login } from "./components/login/Login";
import { Box } from "@mui/system";




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
      </Routes>
      <Footer />
    </BrowserRouter>
  </Box>
 
 
  
  );
}

export default App;
