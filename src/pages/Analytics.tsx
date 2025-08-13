import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Target,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { useTaskStore } from '@/store/taskStore';

export const Analytics = () => {
  const { getAnalytics, initialize, refreshData } = useTaskStore();
  const [period, setPeriod] = useState<number>(30);
  
  const analyticsData = getAnalytics(period);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const handleRefresh = () => {
    refreshData();
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = "default",
    description 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: string;
    color?: "default" | "green" | "blue" | "red" | "yellow";
    description?: string;
  }) => {
    const colorClasses = {
      default: "text-foreground",
      green: "text-green-600 dark:text-green-400",
      blue: "text-blue-600 dark:text-blue-400",
      red: "text-red-600 dark:text-red-400",
      yellow: "text-yellow-600 dark:text-yellow-400",
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${colorClasses[color]}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p className="text-xs text-muted-foreground mt-1">{trend}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <AppLayout 
      title="Analytics" 
      subtitle="Acompanhe sua produtividade e performance"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <label className="text-sm font-medium">Período:</label>
            </div>
            <Select value={period.toString()} onValueChange={(value) => setPeriod(Number(value))}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total de Tarefas"
            value={analyticsData.total}
            icon={BarChart3}
            color="blue"
            description={`nos últimos ${period} dias`}
          />
          
          <StatCard
            title="Tarefas Concluídas"
            value={analyticsData.completed}
            icon={CheckCircle}
            color="green"
            trend={`${analyticsData.completionRate.toFixed(1)}% de conclusão`}
          />
          
          <StatCard
            title="Tarefas Pendentes"
            value={analyticsData.pending}
            icon={Clock}
            color="yellow"
            description="aguardando conclusão"
          />
          
          <StatCard
            title="Tarefas em Atraso"
            value={analyticsData.overdue}
            icon={AlertTriangle}
            color="red"
            description="passaram da data limite"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <AnalyticsChart data={analyticsData} type="overview" />
          <AnalyticsChart data={analyticsData} type="priority" />
        </div>

        {/* Timeline Chart */}
        <AnalyticsChart data={analyticsData} type="timeline" />

        {/* Priority Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Distribuição por Prioridade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Alta Prioridade</span>
                    <Badge variant="destructive" className="text-xs">
                      {analyticsData.byPriority.high} tarefas
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${analyticsData.total > 0 ? (analyticsData.byPriority.high / analyticsData.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Média Prioridade</span>
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      {analyticsData.byPriority.medium} tarefas
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${analyticsData.total > 0 ? (analyticsData.byPriority.medium / analyticsData.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Baixa Prioridade</span>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      {analyticsData.byPriority.low} tarefas
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${analyticsData.total > 0 ? (analyticsData.byPriority.low / analyticsData.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights e Recomendações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.completionRate >= 80 && (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Excelente produtividade!</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Você está com uma taxa de conclusão de {analyticsData.completionRate.toFixed(1)}%. Continue assim!
                </p>
              </div>
            )}

            {analyticsData.overdue > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Atenção às tarefas em atraso</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Você tem {analyticsData.overdue} tarefa(s) em atraso. Considere revisar os prazos ou reorganizar prioridades.
                </p>
              </div>
            )}

            {analyticsData.byPriority.high > analyticsData.byPriority.medium + analyticsData.byPriority.low && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">Muitas tarefas de alta prioridade</span>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Considere reavaliar as prioridades ou quebrar tarefas grandes em menores para melhor gestão.
                </p>
              </div>
            )}

            {analyticsData.total === 0 && (
              <div className="p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-medium">Comece criando suas primeiras tarefas</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  Ainda não há dados para análise. Crie algumas tarefas para começar a acompanhar sua produtividade.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};