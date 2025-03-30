import Footer from "./components/footer/Footer"
import LandingPage from "./LandingPage";
import { ThemeProvider } from "./themes/ThemeProvider";
import { Login } from "./components/login/Login";
import { Header } from "./components/header/Header";

function App() {
  
  return (
    <>
      <Header />
      <Login />
      <Footer />
    </>
  )
}

export default App;
