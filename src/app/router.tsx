import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "@/shared/ui/routes/private-route";
import { SignUp } from "@/modules/auth/presentation/pages/sign-up";
import { SignIn } from "@/modules/auth/presentation/pages/sign-in";
import { Home } from "@/modules/task/presentation/pages/home";

export function Router() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
