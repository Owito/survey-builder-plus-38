import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

/**
 * QuestionForm Component
 * Formulario para crear/editar una pregunta de encuesta
 * Soporta tres tipos: texto libre, opción múltiple y escala
 * 
 * @param {Function} onAdd - Callback cuando se añade una pregunta
 */
const QuestionForm = ({ onAdd }) => {
  const [questionText, setQuestionText] = useState('');
  const [questionType, setQuestionType] = useState('text');
  const [options, setOptions] = useState(['', '']);

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!questionText.trim()) {
      return;
    }

    const question = {
      question_text: questionText,
      question_type: questionType,
      options: questionType === 'multiple' ? options.filter(o => o.trim()) : null,
    };

    onAdd(question);
    
    // Reset form
    setQuestionText('');
    setQuestionType('text');
    setOptions(['', '']);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Añadir Pregunta</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="question-text">Texto de la pregunta</Label>
          <Input
            id="question-text"
            placeholder="¿Cuál es tu pregunta?"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="question-type">Tipo de pregunta</Label>
          <Select value={questionType} onValueChange={setQuestionType}>
            <SelectTrigger id="question-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texto libre</SelectItem>
              <SelectItem value="multiple">Opción múltiple</SelectItem>
              <SelectItem value="scale">Escala 1-5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {questionType === 'multiple' && (
          <div className="space-y-2">
            <Label>Opciones</Label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Opción ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOption}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Añadir opción
            </Button>
          </div>
        )}

        <Button onClick={handleSubmit} className="w-full">
          Añadir Pregunta
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;
