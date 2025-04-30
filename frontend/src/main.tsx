import React from "react";
import ReactDOM from "react-dom/client";
// import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./themes/ThemeProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { BookingCartProvider } from "./context/BookingCartContext";

async function enableMocking() {
  if (process.env.NODE_ENV !== "development") {
    console.log("Not in development mode, skipping MSW setup");
    return;
  }

  console.log("Setting up MSW for development...");
  try {
    const { worker } = await import("./mocks/browser");
    console.log("MSW worker imported, starting service worker...");
    await worker.start({
      onUnhandledRequest: "bypass",
    });
    console.log("MSW setup complete! API requests will be mocked.");
  } catch (error) {
    console.error("Error setting up MSW:", error);
  }
}

// Initialize the MSW worker before rendering the app
enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <BookingCartProvider>
            <App />
          </BookingCartProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
});
