import React from "react";
import { Layout } from "antd";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ItemManagement from "./components/Items/ItemManagement";
import "./App.css";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import { Logout } from "./components/Logout";
import { Login } from "./components/login/Login";
import { Header } from "./components/Header";
import SignUp from "./components/SignUp";

const { Content, Footer } = Layout;


// import UserDashboard from "./components/User/UserDashboard";
// import UserBookings from "./components/User/UserBookings";

const App: React.FC = () => {
  return (
    <Router>
      <Layout className="layout" style={{ minHeight: "100vh" }}>
        <Header />

        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content" style={{ margin: "16px 0" }}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sideBar" element={<Sidebar />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/items" element={<ItemManagement />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </Content>
        
        <Footer style={{ textAlign: "center" }}>
          Illusia ©{new Date().getFullYear()} Created with ❤️
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
