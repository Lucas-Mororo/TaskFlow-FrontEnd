import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Share2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchBar } from '@/components/tasks/SearchBar';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useTaskStore } from '@/store/taskStore';
import { getTaskById } from '@/lib/storage';
import { toast } from 'sonner';

export const SharedTasks = () => {
  const [searchParams] = useSearchParams();
  const { 
    sharedTasks, 
    loading, 
    initialize, 
    searchQuery 
  } = useTaskStore();
  
  const [publicTask, setPublicTask] = useState(null);
  const taskId = searchParams.get('taskId');

  useEffect(() => {
    initialize();
    
    // If there's a taskId in query params, try to load that specific task
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        setPublicTask(task);
        toast.success('Tarefa compartilhada carregada com sucesso!');
      } else {
        toast.error('Tarefa não encontrada ou link inválido');
      }
    }
  }, [initialize, taskId]);

  // Filter shared tasks based on search
  const filteredSharedTasks = sharedTasks.filter(task =>
    !searchQuery || 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalTasks = publicTask ? 1 + filteredSharedTasks.length : filteredSharedTasks.length;

  return (
    <AppLayout 
      title="Tarefas Compartilhadas" 
      subtitle={`${totalTasks} tarefas compartilhadas`}
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <SearchBar />
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>Modo somente leitura</span>
          </div>
        </div>

        {/* Public Task (from URL) */}
        {publicTask && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Tarefa Compartilhada via Link</h2>
              <Badge variant="outline" className="text-xs">
                Link Público
              </Badge>
            </div>
            
            <TaskCard
              task={publicTask}
              isShared={true}
            />
            
            {filteredSharedTasks.length > 0 && (
              <hr className="my-6" />
            )}
          </div>
        )}

        {/* Shared Tasks */}
        {filteredSharedTasks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Tarefas Compartilhadas Comigo</h2>
              <Badge variant="secondary" className="text-xs">
                {filteredSharedTasks.length} tarefas
              </Badge>
            </div>

            <div className="grid gap-4">
              {filteredSharedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isShared={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!publicTask && filteredSharedTasks.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="text-6xl">🤝</div>
                <div>
                  <h3 className="text-lg font-semibold">Nenhuma tarefa compartilhada</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? 'Nenhuma tarefa compartilhada corresponde à sua busca.'
                      : 'Você ainda não recebeu tarefas compartilhadas ou não há tarefas públicas para visualizar.'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Para acessar uma tarefa compartilhada via link, cole o URL completo na barra de endereços.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formato: /shared?taskId=ID_DA_TAREFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Share2 className="h-4 w-4" />
              Como funciona o compartilhamento
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
            <p>• <strong>Tarefas Compartilhadas:</strong> Tarefas que outros usuários compartilharam diretamente com você</p>
            <p>• <strong>Links Públicos:</strong> Tarefas acessíveis via link público (somente leitura)</p>
            <p>• <strong>Visualização:</strong> Você pode ver todas as informações, mas não pode editar tarefas compartilhadas</p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};