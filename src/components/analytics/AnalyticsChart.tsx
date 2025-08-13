import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsData {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  byPriority: {
    high: number;
    medium: number;
    low: number;
  };
  tasksByDay: Array<{
    date: string;
    completed: number;
    created: number;
  }>;
}

interface AnalyticsChartProps {
  data: AnalyticsData;
  type: 'overview' | 'priority' | 'timeline';
}

export const AnalyticsChart = ({ data, type }: AnalyticsChartProps) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const overviewData = useMemo(() => ({
    labels: ['Concluídas', 'Pendentes', 'Em Atraso'],
    datasets: [
      {
        data: [data.completed, data.pending - data.overdue, data.overdue],
        backgroundColor: [
          'rgb(34, 197, 94)',   // green-500
          'rgb(59, 130, 246)',  // blue-500
          'rgb(239, 68, 68)',   // red-500
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  }), [data.completed, data.pending, data.overdue]);

  const priorityData = useMemo(() => ({
    labels: ['Alta', 'Média', 'Baixa'],
    datasets: [
      {
        label: 'Tarefas por Prioridade',
        data: [data.byPriority.high, data.byPriority.medium, data.byPriority.low],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',   // red-500
          'rgba(245, 158, 11, 0.8)',  // amber-500
          'rgba(34, 197, 94, 0.8)',   // green-500
        ],
        borderColor: [
          'rgb(239, 68, 68)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
        ],
        borderWidth: 1,
      },
    ],
  }), [data.byPriority]);

  const timelineData = useMemo(() => {
    const last7Days = data.tasksByDay.slice(-7);
    
    return {
      labels: last7Days.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
      }),
      datasets: [
        {
          label: 'Tarefas Criadas',
          data: last7Days.map(item => item.created),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Tarefas Concluídas',
          data: last7Days.map(item => item.completed),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [data.tasksByDay]);

  const renderChart = () => {
    switch (type) {
      case 'overview':
        return (
          <div className="h-64">
            <Doughnut data={overviewData} options={chartOptions} />
          </div>
        );
      
      case 'priority':
        return (
          <div className="h-64">
            <Bar data={priorityData} options={chartOptions} />
          </div>
        );
      
      case 'timeline':
        return (
          <div className="h-64">
            <Line data={timelineData} options={chartOptions} />
          </div>
        );
      
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'overview':
        return 'Visão Geral das Tarefas';
      case 'priority':
        return 'Tarefas por Prioridade';
      case 'timeline':
        return 'Atividade dos Últimos 7 Dias';
      default:
        return 'Gráfico';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
};