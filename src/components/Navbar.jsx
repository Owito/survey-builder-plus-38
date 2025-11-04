import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3 } from 'lucide-react';

/**
 * Navbar Component
 * Barra de navegación principal de la aplicación
 * Muestra diferentes opciones según el estado de autenticación
 */
const Navbar = () => {
  const { user, signOut, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Sistema de Encuestas</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {profile?.email}
                  {profile?.role === 'admin' && (
                    <span className="ml-2 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-semibold">
                      Admin
                    </span>
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/auth')} variant="default">
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
