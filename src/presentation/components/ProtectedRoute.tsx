import { Navigate } from 'react-router-dom';
import { getStoredToken } from '../../core/domain/auth/AuthUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
