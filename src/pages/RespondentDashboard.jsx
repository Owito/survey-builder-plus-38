import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle } from 'lucide-react';

/**
 * RespondentDashboard Page
 * Pantalla con encuestas disponibles y formulario de respuesta
 * Solo accesible para usuarios con rol "respondiente"
 */
const RespondentDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [answeredSurveys, setAnsweredSurveys] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, [user]);

  const loadSurveys = async () => {
    try {
      // Cargar encuestas publicadas
      const { data: surveysData, error: surveysError } = await supabase
        .from('surveys')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (surveysError) throw surveysError;

      // Cargar encuestas ya respondidas por el usuario
      const { data: responsesData, error: responsesError } = await supabase
        .from('responses')
        .select('survey_id')
        .eq('user_id', user.id);

      if (responsesError) throw responsesError;

      const answered = new Set(responsesData?.map(r => r.survey_id) || []);
      
      setSurveys(surveysData || []);
      setAnsweredSurveys(answered);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAnswered = (surveyId) => answeredSurveys.has(surveyId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Encuestas Disponibles</h1>
          <p className="text-muted-foreground">
            Bienvenido, {profile?.full_name || profile?.email}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay encuestas disponibles en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <Card key={survey.id} className={hasAnswered(survey.id) ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{survey.title}</CardTitle>
                    {hasAnswered(survey.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardDescription>{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Creada el {new Date(survey.created_at).toLocaleDateString('es-ES')}
                  </p>
                </CardContent>
                <CardFooter>
                  {hasAnswered(survey.id) ? (
                    <Button variant="outline" className="w-full" disabled>
                      Ya respondida
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/take-survey/${survey.id}`)}
                    >
                      Responder Encuesta
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RespondentDashboard;
