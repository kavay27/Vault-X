import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./context/userContext.jsx";
import { VaultProvider } from "./context/vaultContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="134350357466-ell6ui4rfeitajq049tup5qup68e7bi1.apps.googleusercontent.com">
        <UserContextProvider>
          <VaultProvider>
            <App />
          </VaultProvider>
        </UserContextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
