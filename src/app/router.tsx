import { Routes, Route } from "react-router-dom";

import { SignUp } from "@/modules/auth/presentation/pages/sign-up";

export function Router() {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}
