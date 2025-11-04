import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import QuestionForm from '@/components/QuestionForm';
import QuestionList from '@/components/QuestionList';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

/**
 * EditSurvey Page
 * Página para editar una encuesta existente
 */
const EditSurvey = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurvey();
  }, [id]);

  const loadSurvey = async () => {
    try {
      // Cargar encuesta
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .single();

      if (surveyError) throw surveyError;

      if (surveyData.created_by !== user.id) {
        toast({
          title: "Error",
          description: "No tienes permiso para editar esta encuesta.",
          variant: "destructive",
        });
        navigate('/dashboard');
        return;
      }

      setTitle(surveyData.title);
      setDescription(surveyData.description || '');
      setIsPublished(surveyData.is_published);

      // Cargar preguntas existentes
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('survey_id', id)
        .order('order_number', { ascending: true });

      if (questionsError) throw questionsError;
      
      setExistingQuestions(questionsData || []);
      setQuestions([]);
    } catch (error) {
      console.error('Error cargando encuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la encuesta.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = (question) => {
    setQuestions([...questions, { ...question, order_number: existingQuestions.length + questions.length }]);
  };

  const handleRemoveNewQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleRemoveExistingQuestion = async (questionId) => {
    if (!confirm('¿Eliminar esta pregunta? Esto también eliminará sus respuestas.')) return;

    try {
      const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', questionId);

      if (error) throw error;

      setExistingQuestions(existingQuestions.filter(q => q.id !== questionId));
      toast({
        title: "Pregunta eliminada",
        description: "La pregunta ha sido eliminada correctamente.",
      });
    } catch (error) {
      console.error('Error eliminando pregunta:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la pregunta.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    if (existingQuestions.length === 0 && questions.length === 0) {
      toast({
        title: "Error",
        description: "Debes tener al menos una pregunta.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Actualizar encuesta
      const { error: surveyError } = await supabase
        .from('surveys')
        .update({
          title,
          description,
          is_published: isPublished,
        })
        .eq('id', id);

      if (surveyError) throw surveyError;

      // Insertar nuevas preguntas si las hay
      if (questions.length > 0) {
        const questionsToInsert = questions.map((q) => ({
          ...q,
          survey_id: id,
        }));

        const { error: questionsError } = await supabase
          .from('questions')
          .insert(questionsToInsert);

        if (questionsError) throw questionsError;
      }

      toast({
        title: "¡Éxito!",
        description: "La encuesta ha sido actualizada correctamente.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error actualizando encuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la encuesta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const allQuestions = [...existingQuestions, ...questions];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-8">Editar Encuesta</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la encuesta *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
                <Label htmlFor="published" className="cursor-pointer">
                  Publicar encuesta
                </Label>
              </div>
            </CardContent>
          </Card>

          <QuestionForm onAdd={handleAddQuestion} />

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Preguntas Existentes ({existingQuestions.length})
            </h3>
            {existingQuestions.length > 0 ? (
              <div className="space-y-3">
                {existingQuestions.map((question, index) => (
                  <Card key={question.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg mb-2">
                            {index + 1}. {question.question_text}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {question.question_type === 'text' && 'Texto libre'}
                            {question.question_type === 'multiple' && 'Opción múltiple'}
                            {question.question_type === 'scale' && 'Escala 1-5'}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveExistingQuestion(question.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No hay preguntas existentes.</p>
            )}
          </div>

          {questions.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Nuevas Preguntas ({questions.length})
              </h3>
              <QuestionList questions={questions} onRemove={handleRemoveNewQuestion} />
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditSurvey;
