import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
 * CreateSurvey Page
 * Página para crear una nueva encuesta con preguntas personalizadas
 */
const CreateSurvey = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, { ...question, order_number: questions.length }]);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
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

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Debes añadir al menos una pregunta.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Crear encuesta
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .insert([
          {
            title,
            description,
            created_by: user.id,
            is_published: isPublished,
          },
        ])
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Crear preguntas
      const questionsToInsert = questions.map((q) => ({
        ...q,
        survey_id: surveyData.id,
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;

      toast({
        title: "¡Éxito!",
        description: "La encuesta ha sido creada correctamente.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error creando encuesta:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la encuesta.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

        <h1 className="text-3xl font-bold mb-8">Crear Nueva Encuesta</h1>

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
                  placeholder="Ej: Encuesta de Satisfacción 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el propósito de esta encuesta..."
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
                  Publicar encuesta (los usuarios podrán responderla)
                </Label>
              </div>
            </CardContent>
          </Card>

          <QuestionForm onAdd={handleAddQuestion} />

          <div>
            <h3 className="text-xl font-semibold mb-4">
              Preguntas ({questions.length})
            </h3>
            <QuestionList questions={questions} onRemove={handleRemoveQuestion} />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creando...' : 'Crear Encuesta'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateSurvey;
