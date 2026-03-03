import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/shared/ui/store/auth-store";

export function PrivateRoute() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return null; // ou <Spinner />
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
}
