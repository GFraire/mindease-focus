import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { Router } from "./router";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Router />

        <Toaster />
      </BrowserRouter>
    </>
  );
}
