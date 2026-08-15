// TODO: Componente que protege rutas que requieren autenticación.
// Redirigirá a /login si el usuario no está autenticado.
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Mock de autenticación (después se usará el contexto real)
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};