import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./themes/ThemeProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./i18n/i18n.ts";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider> 
    </ThemeProvider>
  </StrictMode>
);
