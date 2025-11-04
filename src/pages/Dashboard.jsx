import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import SurveyCard from '@/components/SurveyCard';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Dashboard Page
 * Panel principal que muestra encuestas creadas y publicadas
 * Diferencia entre vista de administrador y usuario normal
 */
const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, [user]);

  const loadSurveys = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las encuestas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (surveyId) => {
    if (!confirm('¿Estás seguro de eliminar esta encuesta?')) return;

    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', surveyId);

      if (error) throw error;

      toast({
        title: "Encuesta eliminada",
        description: "La encuesta ha sido eliminada correctamente.",
      });

      loadSurveys();
    } catch (error) {
      console.error('Error eliminando encuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la encuesta.",
        variant: "destructive",
      });
    }
  };

  const mySurveys = surveys.filter(s => s.created_by === user?.id);
  const publishedSurveys = surveys.filter(s => s.is_published && s.created_by !== user?.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Panel de Control</h1>
              <p className="text-muted-foreground">
                Bienvenido al Sistema de Encuestas Web
              </p>
            </div>
            <Button onClick={() => navigate('/create-survey')} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Crear Encuesta
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Mis Encuestas</h2>
              {mySurveys.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySurveys.map((survey) => (
                    <SurveyCard
                      key={survey.id}
                      survey={survey}
                      isOwner={true}
                      onEdit={(survey) => navigate(`/edit-survey/${survey.id}`)}
                      onDelete={handleDelete}
                      onViewResults={(survey) => navigate(`/reports/${survey.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No has creado encuestas aún. Haz clic en "Crear Encuesta" para comenzar.
                  </AlertDescription>
                </Alert>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Encuestas Disponibles</h2>
              {publishedSurveys.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedSurveys.map((survey) => (
                    <SurveyCard
                      key={survey.id}
                      survey={survey}
                      isOwner={false}
                      onView={(survey) => navigate(`/take-survey/${survey.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay encuestas publicadas disponibles en este momento.
                  </AlertDescription>
                </Alert>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
