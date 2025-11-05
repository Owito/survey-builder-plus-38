import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import SurveyCard from '@/components/SurveyCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * SurveyorDashboard Page
 * Panel para encuestadores con funciones de creación, edición y eliminación de encuestas
 * Solo accesible para usuarios con rol "encuestador"
 */
const SurveyorDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, [user]);

  const loadSurveys = async () => {
    try {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Panel de Encuestador</h1>
            <p className="text-muted-foreground">
              Bienvenido, {profile?.full_name || profile?.email}
            </p>
          </div>
          <Button onClick={() => navigate('/create-survey')}>
            <Plus className="mr-2 h-4 w-4" />
            Crear Encuesta
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No has creado encuestas aún</p>
            <Button onClick={() => navigate('/create-survey')}>
              <Plus className="mr-2 h-4 w-4" />
              Crear tu primera encuesta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <SurveyCard 
                key={survey.id} 
                survey={survey} 
                onUpdate={loadSurveys}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SurveyorDashboard;
