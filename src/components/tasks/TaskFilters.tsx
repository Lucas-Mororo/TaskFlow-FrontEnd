import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';

export const TaskFilters = () => {
  const { filters, setFilters, tasks } = useTaskStore();

  // Get unique tags from all tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags)));

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    setFilters({ tags: newTags });
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      priority: 'all',
      tags: [],
    });
  };

  const hasActiveFilters = filters.status !== 'all' || 
                          filters.priority !== 'all' || 
                          filters.tags.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {/* Status Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={filters.status} onValueChange={(value) => setFilters({ status: value as any })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="todo">Pendentes</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluídas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Prioridade</label>
          <Select value={filters.priority} onValueChange={(value) => setFilters({ priority: value as any })}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="flex flex-col gap-2">
            <div className="h-6"></div> {/* Spacer to align with other filters */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearFilters}
              className="h-10"
            >
              <X className="h-4 w-4 mr-1" />
              Limpar Filtros
            </Button>
          </div>
        )}
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? "default" : "secondary"}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
                {filters.tags.includes(tag) && (
                  <X className="h-3 w-3 ml-1" />
                )}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="text-sm text-muted-foreground">
          Filtros ativos: {filters.status !== 'all' && `Status: ${filters.status}`}
          {filters.priority !== 'all' && `, Prioridade: ${filters.priority}`}
          {filters.tags.length > 0 && `, Tags: ${filters.tags.join(', ')}`}
        </div>
      )}
    </div>
  );
};