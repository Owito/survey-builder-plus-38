import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, CheckCircle2, Users, FileText } from 'lucide-react';

/**
 * Index Page - Landing Page
 * Página de inicio del sistema que redirige usuarios autenticados al dashboard
 */
const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Sistema de Encuestas</span>
          </div>
          <Button onClick={() => navigate('/auth')}>
            Iniciar Sesión
          </Button>
        </div>
      </nav>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Sistema de Encuestas Web
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Crea, comparte y analiza encuestas personalizadas de manera fácil y eficiente. 
              Ideal para instituciones educativas y organizaciones.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Comenzar Ahora
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-card py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Creación Flexible</h3>
                <p className="text-muted-foreground">
                  Crea encuestas con preguntas de texto libre, opción múltiple o escalas de valoración.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestión de Usuarios</h3>
                <p className="text-muted-foreground">
                  Sistema de autenticación seguro con roles de administrador y usuario.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Análisis de Resultados</h3>
                <p className="text-muted-foreground">
                  Visualiza respuestas en tablas claras y exporta datos a CSV para análisis detallado.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Únete al Sistema de Encuestas del Politécnico Grancolombiano
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Crear Cuenta Gratis
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Sistema de Encuestas Web - Politécnico Grancolombiano</p>
          <p className="text-sm mt-2">Proyecto Académico - Desarrollo de Software en Equipo (TSP)</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
