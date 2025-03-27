import LandingPage from "./LandingPage";
import { ThemeProvider } from "./themes/ThemeProvider";

function App() {
  
  return (
    
      <ThemeProvider>
        <h1>HEADER</h1>
        <LandingPage />
        <h1>FOOTER</h1>
      </ThemeProvider>
 );
}

export default App;
