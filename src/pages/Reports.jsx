import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Reports Page
 * Página para ver reportes y exportar resultados de encuestas
 * Solo accesible por el creador de la encuesta
 */
const Reports = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      if (surveyError) throw surveyError;

      if (surveyData.created_by !== user.id) {
        toast({
          title: "Error",
          description: "No tienes permiso para ver estos resultados.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setSurvey(surveyData);

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('survey_id', id)
        .order('order_number', { ascending: true });

      if (questionsError) throw questionsError;
      setQuestions(questionsData || []);

      const { data: responsesData, error: responsesError } = await supabase
        .from('responses')
        .select(`
          *,
          profiles:user_id (email)
        `)
        .eq('survey_id', id)
        .order('created_at', { ascending: false });

      if (responsesError) throw responsesError;
      setResponses(responsesData || []);
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los resultados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (responses.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay respuestas para exportar.",
        variant: "destructive",
      });
      return;
    }

    // Agrupar respuestas por usuario
    const responsesByUser = {};
    responses.forEach(response => {
      const userId = response.user_id;
      if (!responsesByUser[userId]) {
        responsesByUser[userId] = {
          email: response.profiles?.email || 'Desconocido',
          fecha: format(new Date(response.created_at), "dd/MM/yyyy HH:mm", { locale: es }),
          answers: {}
        };
      }
      const question = questions.find(q => q.id === response.question_id);
      if (question) {
        responsesByUser[userId].answers[question.question_text] = response.answer_text;
      }
    });

    // Crear CSV
    const headers = ['Email', 'Fecha', ...questions.map(q => q.question_text)];
    const csvContent = [
      headers.join(','),
      ...Object.values(responsesByUser).map(user => {
        return [
          `"${user.email}"`,
          `"${user.fecha}"`,
          ...questions.map(q => `"${user.answers[q.question_text] || ''}"`)
        ].join(',');
      })
    ].join('\n');

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `resultados_${survey.title.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();

    toast({
      title: "Exportación exitosa",
      description: "El archivo CSV ha sido descargado.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!survey) {
    return null;
  }

  // Agrupar respuestas por usuario
  const responsesByUser = {};
  responses.forEach(response => {
    const userId = response.user_id;
    if (!responsesByUser[userId]) {
      responsesByUser[userId] = {
        email: response.profiles?.email || 'Desconocido',
        fecha: response.created_at,
        answers: {}
      };
    }
    responsesByUser[userId].answers[response.question_id] = response.answer_text;
  });

  const usersResponses = Object.entries(responsesByUser);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resultados de la Encuesta</h1>
            <p className="text-xl text-muted-foreground">{survey.title}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Total de respuestas: {usersResponses.length}
            </p>
          </div>
          <Button onClick={exportToCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar a CSV
          </Button>
        </div>

        {usersResponses.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No hay respuestas registradas para esta encuesta aún.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Respuestas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Fecha</TableHead>
                      {questions.map((question) => (
                        <TableHead key={question.id}>{question.question_text}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersResponses.map(([userId, userData]) => (
                      <TableRow key={userId}>
                        <TableCell className="font-medium">{userData.email}</TableCell>
                        <TableCell>
                          {format(new Date(userData.fecha), "dd/MM/yyyy HH:mm", { locale: es })}
                        </TableCell>
                        {questions.map((question) => (
                          <TableCell key={question.id}>
                            {userData.answers[question.id] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen estadístico para preguntas de escala */}
        {questions.some(q => q.question_type === 'scale') && usersResponses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Resumen Estadístico</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {questions
                .filter(q => q.question_type === 'scale')
                .map((question) => {
                  const answers = usersResponses
                    .map(([, userData]) => Number(userData.answers[question.id]))
                    .filter(n => !isNaN(n));
                  
                  const average = answers.length > 0
                    ? (answers.reduce((a, b) => a + b, 0) / answers.length).toFixed(2)
                    : 'N/A';

                  return (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{question.question_text}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">{average}</div>
                        <p className="text-sm text-muted-foreground">Promedio de {answers.length} respuestas</p>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;
