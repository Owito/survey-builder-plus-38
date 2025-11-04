import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * QuestionList Component
 * Lista de preguntas de una encuesta con opción de eliminar
 * 
 * @param {Array} questions - Array de preguntas
 * @param {Function} onRemove - Callback para eliminar una pregunta
 */
const QuestionList = ({ questions, onRemove }) => {
  const getTypeLabel = (type) => {
    const types = {
      text: 'Texto libre',
      multiple: 'Opción múltiple',
      scale: 'Escala 1-5'
    };
    return types[type] || type;
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground">
          No hay preguntas añadidas aún. Añade tu primera pregunta arriba.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((question, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex items-start pt-1">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-medium text-lg">{index + 1}. {question.question_text}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{getTypeLabel(question.question_type)}</Badge>
                  
                  {question.question_type === 'multiple' && question.options && (
                    <div className="flex flex-wrap gap-1">
                      {question.options.map((option, optIndex) => (
                        <Badge key={optIndex} variant="outline" className="text-xs">
                          {option}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuestionList;
