import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * RoleProtectedRoute Component
 * Protege rutas que requieren un rol específico
 * Redirige si el usuario no tiene el rol adecuado
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Componente a renderizar si tiene el rol correcto
 * @param {Array<string>} props.allowedRoles - Array de roles permitidos para esta ruta
 */
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirigir a la página apropiada según su rol
    if (role === 'administrador') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === 'encuestador') {
      return <Navigate to="/surveys/dashboard" replace />;
    } else {
      return <Navigate to="/encuestas" replace />;
    }
  }

  return children;
};

export default RoleProtectedRoute;
