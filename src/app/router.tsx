import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "@/shared/ui/routes/private-route";
import { SignUp } from "@/modules/auth/presentation/pages/sign-up";
import { SignIn } from "@/modules/auth/presentation/pages/sign-in";
import { Home } from "@/modules/task/presentation/pages/home";
import { CreateTask } from "@/modules/task/presentation/pages/create-task";
import { Tasks } from "@/modules/task/presentation/pages/tasks";
import { EditTask } from "@/modules/task/presentation/pages/edit-task";

export function Router() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />

      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/create-task" element={<CreateTask />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/edit-task/:taskId" element={<EditTask />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/tasks" element={<Tasks />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}
