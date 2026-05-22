import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Cargando...</p>;

  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export default ProtectedRoute;
