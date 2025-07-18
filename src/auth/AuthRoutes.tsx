import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

interface AuthRoutesProps {
  children: JSX.Element;
}

const devMode = false; // Cambia esto a true para desactivar la protección de rutas

export default function AuthRoutes({ children }: AuthRoutesProps) {
  const { token } = useAuth();
  if (devMode) {
    return children;
  }

  return token ? children : <Navigate to="/login" replace />;
}
