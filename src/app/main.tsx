import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initAuthListener } from "./init-auth-listener";

import App from "./app";

import "./index.css";
import { ThemeProvider } from "@/shared/ui/providers/theme-provider";

initAuthListener();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
