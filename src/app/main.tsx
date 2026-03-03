import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initAuthListener } from "./init-auth-listener";

import App from "./app";

import "./index.css";

initAuthListener();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
