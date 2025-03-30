import LandingPage from "./LandingPage";
import { ThemeProvider } from "./themes/ThemeProvider";

function App() {
  
  return (
    
      <ThemeProvider>
        
        <LandingPage />
        
      </ThemeProvider>
 );
}

export default App;
