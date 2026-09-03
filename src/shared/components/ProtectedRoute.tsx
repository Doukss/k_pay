import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'agency';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirige vers /connexion et remplace l'historique pour interdire le retour arrière
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Si l'utilisateur n'a pas le bon rôle, redirige vers son espace légitime
    const fallbackPath = user.role === 'admin' ? '/admin/dashboard' : '/agence/dashboard';
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
