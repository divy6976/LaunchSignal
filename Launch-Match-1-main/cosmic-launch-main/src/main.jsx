import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID || "").trim();
const hasGoogleClientId = Boolean(googleClientId);

if (!hasGoogleClientId) {
  console.warn("VITE_GOOGLE_CLIENT_ID is not set. Google login will be disabled.");
}

createRoot(document.getElementById("root")).render(
  hasGoogleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  ) : (
    <App />
  )
);
