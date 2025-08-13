import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchBar } from '@/components/tasks/SearchBar';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskCard } from '@/components/tasks/TaskCard';
import { useTaskStore } from '@/store/taskStore';
import { Skeleton } from '@/components/ui/skeleton';

export const Tasks = () => {
  const navigate = useNavigate();
  const { 
    getFilteredTasks, 
    loading, 
    initialize,
    refreshData 
  } = useTaskStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [tasksPerPage] = useState(10);

  const filteredTasks = getFilteredTasks();
  
  // Pagination
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const startIndex = (page - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  useEffect(() => {
    initialize();
    
    // Set up periodic refresh for due task notifications
    const interval = setInterval(() => {
      refreshData();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [initialize, refreshData]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [filteredTasks.length]);

  const handleTaskEdit = (taskId: string) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  const handleTaskShare = (taskId: string) => {
    const shareUrl = `${window.location.origin}/shared?taskId=${taskId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link de compartilhamento copiado para a área de transferência!');
    });
  };

  const handleCreateTask = () => {
    navigate('/tasks/new');
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const TasksSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <AppLayout 
      title="Minhas Tarefas" 
      subtitle={`${filteredTasks.length} tarefas encontradas`}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <SearchBar />
            
            <Collapsible open={showFilters} onOpenChange={setShowFilters}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          <Button onClick={handleCreateTask} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Filters */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <TaskFilters />
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {loading ? (
            <TasksSkeleton />
          ) : filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="text-6xl">📝</div>
                  <div>
                    <h3 className="text-lg font-semibold">Nenhuma tarefa encontrada</h3>
                    <p className="text-muted-foreground">
                      Crie sua primeira tarefa ou ajuste os filtros de busca.
                    </p>
                  </div>
                  <Button onClick={handleCreateTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Tarefa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4">
                {paginatedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={() => handleTaskEdit(task.id)}
                    onShare={() => handleTaskShare(task.id)}
                  />
                ))}
              </div>

              {/* Infinite Scroll / Load More */}
              {page < totalPages && (
                <div className="text-center pt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Carregar Mais'}
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Mostrando {endIndex} de {filteredTasks.length} tarefas
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};