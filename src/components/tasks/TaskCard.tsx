import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Edit3, 
  Trash2, 
  Share2, 
  CheckCircle, 
  Circle,
  PlayCircle,
  AlertTriangle
} from 'lucide-react';
import { Task } from '@/lib/storage';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTaskStore } from '@/store/taskStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit?: () => void;
  onShare?: () => void;
  isShared?: boolean;
}

export const TaskCard = ({ task, onEdit, onShare, isShared = false }: TaskCardProps) => {
  const { updateExistingTask, deleteExistingTask } = useTaskStore();

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const statusIcons = {
    todo: Circle,
    in_progress: PlayCircle,
    completed: CheckCircle,
  };

  const StatusIcon = statusIcons[task.status];

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  const isOverdue = task.status !== 'completed' && isPast(task.dueDate);

  const handleStatusChange = async () => {
    try {
      const newStatus = task.status === 'completed' ? 'todo' : 
                       task.status === 'todo' ? 'in_progress' : 'completed';
      
      await updateExistingTask(task.id, { status: newStatus });
      
      const statusMessages = {
        todo: 'Tarefa marcada como pendente',
        in_progress: 'Tarefa em andamento',
        completed: 'Tarefa concluída! 🎉',
      };
      
      toast.success(statusMessages[newStatus]);
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;
    
    try {
      await deleteExistingTask(task.id);
      toast.success('Tarefa deletada com sucesso');
    } catch (error) {
      toast.error('Erro ao deletar tarefa');
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const { searchQuery } = useTaskStore();

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all duration-200 hover:scale-[1.02]",
      task.status === 'completed' && "opacity-75",
      isOverdue && "border-destructive/50"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="mt-0.5 p-0 h-auto hover:bg-transparent"
              onClick={handleStatusChange}
              disabled={isShared}
            >
              <StatusIcon 
                className={cn(
                  "h-5 w-5 transition-colors",
                  task.status === 'completed' && "text-green-600",
                  task.status === 'in_progress' && "text-blue-600",
                  task.status === 'todo' && "text-muted-foreground"
                )}
              />
            </Button>
            
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold leading-tight truncate",
                task.status === 'completed' && "line-through text-muted-foreground"
              )}>
                {highlightText(task.title, searchQuery)}
              </h3>
              
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {highlightText(task.description, searchQuery)}
                </p>
              )}
            </div>
          </div>

          <Badge 
            variant="secondary" 
            className={cn("text-xs shrink-0", priorityColors[task.priority])}
          >
            {task.priority === 'high' ? 'Alta' : 
             task.priority === 'medium' ? 'Média' : 'Baixa'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {highlightText(tag, searchQuery)}
                </Badge>
              ))}
            </div>
          )}

          {/* Due date */}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={cn(
              isOverdue && "text-destructive font-medium"
            )}>
              {getDateDisplay(task.dueDate)}
            </span>
            {isOverdue && (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
          </div>

          {/* Actions */}
          {!isShared && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={onEdit}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Criada em {format(task.createdAt, 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
            
            {task.completedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Concluída em {format(task.completedAt, 'dd/MM/yyyy', { locale: ptBR })}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};