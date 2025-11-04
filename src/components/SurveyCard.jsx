import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * SurveyCard Component
 * Tarjeta que muestra información resumida de una encuesta
 * 
 * @param {Object} survey - Datos de la encuesta
 * @param {Function} onEdit - Callback para editar encuesta (opcional)
 * @param {Function} onDelete - Callback para eliminar encuesta (opcional)
 * @param {Function} onView - Callback para ver encuesta
 * @param {Function} onViewResults - Callback para ver resultados (opcional)
 * @param {boolean} isOwner - Indica si el usuario es el creador
 */
const SurveyCard = ({ survey, onEdit, onDelete, onView, onViewResults, isOwner = false }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{survey.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {survey.description || 'Sin descripción'}
            </CardDescription>
          </div>
          <Badge variant={survey.is_published ? "default" : "secondary"}>
            {survey.is_published ? 'Publicada' : 'Borrador'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Creada el {format(new Date(survey.created_at), "d 'de' MMMM, yyyy", { locale: es })}
        </p>
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap">
        {isOwner ? (
          <>
            <Button variant="outline" size="sm" onClick={() => onEdit(survey)} className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button variant="outline" size="sm" onClick={() => onViewResults(survey)} className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Resultados
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(survey.id)} className="flex items-center gap-1">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          </>
        ) : (
          <Button variant="default" size="sm" onClick={() => onView(survey)} className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Responder
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SurveyCard;
