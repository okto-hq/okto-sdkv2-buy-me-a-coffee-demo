/** @format */

import { OktoClientConfig, OktoProvider } from "@okto_web3/react-sdk";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const config: OktoClientConfig = {
  environment: import.meta.env.VITE_OKTO_ENVIRONMENT,
  clientPrivateKey: import.meta.env.VITE_OKTO_CLIENT_PRIVATE_KEY,
  clientSWA: import.meta.env.VITE_OKTO_CLIENT_SWA,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <OktoProvider config={config}>
        <App />
      </OktoProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
