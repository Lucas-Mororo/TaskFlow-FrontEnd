import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Plus,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    total: 24,
    completed: 15,
    pending: 6,
    overdue: 3,
    completionRate: 62.5
  });

  const quickStats = [
    {
      title: 'Total de Tarefas',
      value: stats.total,
      icon: CheckSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Concluídas',
      value: stats.completed,
      icon: CheckSquare,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Pendentes',
      value: stats.pending,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Atrasadas',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10'
    }
  ];

  const recentTasks = [
    {
      id: '1',
      title: 'Finalizar relatório mensal',
      priority: 'high',
      dueDate: '2024-12-15',
      status: 'in_progress'
    },
    {
      id: '2',
      title: 'Revisar código do projeto',
      priority: 'medium',
      dueDate: '2024-12-16',
      status: 'todo'
    },
    {
      id: '3',
      title: 'Preparar apresentação',
      priority: 'high',
      dueDate: '2024-12-14',
      status: 'completed'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'in_progress': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <AppLayout 
      title={`Bem-vindo, ${profile?.full_name?.split(' ')[0] || 'Usuário'}!`}
      subtitle="Aqui está um resumo das suas tarefas"
    >
      <div className="space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="glass-card border-0 shadow-medium hover:shadow-strong transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Overview */}
          <Card className="glass-card border-0 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Progresso Mensal</span>
              </CardTitle>
              <CardDescription>
                Taxa de conclusão das suas tarefas este mês
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso Geral</span>
                  <span className="font-medium">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="h-2" />
              </div>
              
              <div className="space-y-3 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Concluídas</span>
                  <span className="text-sm font-medium text-success">{stats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Em andamento</span>
                  <span className="text-sm font-medium text-warning">{stats.pending}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Atrasadas</span>
                  <span className="text-sm font-medium text-destructive">{stats.overdue}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="glass-card border-0 shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Tarefas Recentes</span>
                  </CardTitle>
                  <CardDescription>Suas tarefas mais recentes e importantes</CardDescription>
                </div>
                <Button asChild size="sm" className="gradient-primary">
                  <Link to="/tasks/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Nova
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex-1">
                      <h4 className={`font-medium ${getStatusColor(task.status)}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Vencimento: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                      {task.status === 'completed' && (
                        <CheckSquare className="h-4 w-4 text-success" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/tasks">Ver Todas as Tarefas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="glass-card border-0 shadow-medium">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesse rapidamente as funcionalidades mais usadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild className="h-20 gradient-primary shadow-medium hover:shadow-strong transition-all">
                <Link to="/tasks/new" className="flex flex-col space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Nova Tarefa</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 hover:bg-accent">
                <Link to="/tasks" className="flex flex-col space-y-2">
                  <CheckSquare className="h-6 w-6" />
                  <span>Minhas Tarefas</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-20 hover:bg-accent">
                <Link to="/analytics" className="flex flex-col space-y-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Relatórios</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};