import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  status: 'todo' | 'in_progress' | 'completed';
  ownerId: string;
  sharedWith: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: Date;
  preferences: {
    darkMode: boolean;
    language: 'pt' | 'en';
    notifications: boolean;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'task_due' | 'task_shared' | 'task_updated';
  createdAt: Date;
  taskId?: string;
}

// Storage keys
const TASKS_KEY = 'task_manager_tasks';
const USER_KEY = 'task_manager_user';
const NOTIFICATIONS_KEY = 'task_manager_notifications';
const INITIALIZED_KEY = 'task_manager_initialized';

// Initialize mock data if first time
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  const isInitialized = localStorage.getItem(INITIALIZED_KEY);
  if (isInitialized) return;

  // Create mock user
  const mockUser: User = {
    id: 'user-123',
    email: 'user@example.com',
    fullName: 'João Silva',
    avatarUrl: undefined,
    createdAt: new Date(),
    preferences: {
      darkMode: false,
      language: 'pt',
      notifications: true,
    },
  };

  // Create mock tasks
  const mockTasks: Task[] = [
    {
      id: uuidv4(),
      title: 'Finalizar projeto React',
      description: 'Completar todas as funcionalidades do sistema de tarefas',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      priority: 'high',
      tags: ['trabalho', 'desenvolvimento'],
      status: 'in_progress',
      ownerId: mockUser.id,
      sharedWith: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Estudar TypeScript',
      description: 'Revisar conceitos avançados de TypeScript',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      priority: 'medium',
      tags: ['estudo', 'programação'],
      status: 'todo',
      ownerId: mockUser.id,
      sharedWith: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Exercícios físicos',
      description: 'Ir à academia 3x por semana',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Yesterday (overdue)
      priority: 'medium',
      tags: ['saúde', 'fitness'],
      status: 'completed',
      ownerId: mockUser.id,
      sharedWith: [],
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      completedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: 'Reunião de equipe',
      description: 'Discussão sobre o roadmap do produto',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      priority: 'high',
      tags: ['trabalho', 'reunião'],
      status: 'todo',
      ownerId: mockUser.id,
      sharedWith: ['user-456'], // Shared task
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];

  localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
  localStorage.setItem(TASKS_KEY, JSON.stringify(mockTasks));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
  localStorage.setItem(INITIALIZED_KEY, 'true');
};

// User functions
export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) return null;
  
  const user = JSON.parse(userData);
  return {
    ...user,
    createdAt: new Date(user.createdAt),
  };
};

export const updateUser = (updates: Partial<User>): void => {
  if (typeof window === 'undefined') return;
  
  const currentUser = getUser();
  if (!currentUser) return;
  
  const updatedUser = { ...currentUser, ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
};

// Task functions
export const getTasks = (userId: string): Task[] => {
  if (typeof window === 'undefined') return [];
  
  const tasksData = localStorage.getItem(TASKS_KEY);
  if (!tasksData) return [];
  
  const allTasks = JSON.parse(tasksData);
  return allTasks
    .filter((task: Task) => task.ownerId === userId)
    .map((task: Task) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
};

export const getSharedTasks = (userId: string): Task[] => {
  if (typeof window === 'undefined') return [];
  
  const tasksData = localStorage.getItem(TASKS_KEY);
  if (!tasksData) return [];
  
  const allTasks = JSON.parse(tasksData);
  return allTasks
    .filter((task: Task) => task.sharedWith.includes(userId))
    .map((task: Task) => ({
      ...task,
      dueDate: new Date(task.dueDate),
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    }));
};

export const getTaskById = (taskId: string): Task | null => {
  if (typeof window === 'undefined') return null;
  
  const tasksData = localStorage.getItem(TASKS_KEY);
  if (!tasksData) return null;
  
  const allTasks = JSON.parse(tasksData);
  const task = allTasks.find((t: Task) => t.id === taskId);
  
  if (!task) return null;
  
  return {
    ...task,
    dueDate: new Date(task.dueDate),
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
  };
};

export const createTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  if (typeof window === 'undefined') throw new Error('Cannot create task on server');
  
  const newTask: Task = {
    ...taskData,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const tasksData = localStorage.getItem(TASKS_KEY);
  const allTasks = tasksData ? JSON.parse(tasksData) : [];
  
  allTasks.push(newTask);
  localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  
  return newTask;
};

export const updateTask = (taskId: string, updates: Partial<Task>): Task | null => {
  if (typeof window === 'undefined') return null;
  
  const tasksData = localStorage.getItem(TASKS_KEY);
  if (!tasksData) return null;
  
  const allTasks = JSON.parse(tasksData);
  const taskIndex = allTasks.findIndex((task: Task) => task.id === taskId);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = {
    ...allTasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
    completedAt: updates.status === 'completed' ? new Date() : allTasks[taskIndex].completedAt,
  };
  
  allTasks[taskIndex] = updatedTask;
  localStorage.setItem(TASKS_KEY, JSON.stringify(allTasks));
  
  return {
    ...updatedTask,
    dueDate: new Date(updatedTask.dueDate),
    createdAt: new Date(updatedTask.createdAt),
    updatedAt: new Date(updatedTask.updatedAt),
    completedAt: updatedTask.completedAt ? new Date(updatedTask.completedAt) : undefined,
  };
};

export const deleteTask = (taskId: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  const tasksData = localStorage.getItem(TASKS_KEY);
  if (!tasksData) return false;
  
  const allTasks = JSON.parse(tasksData);
  const filteredTasks = allTasks.filter((task: Task) => task.id !== taskId);
  
  if (filteredTasks.length === allTasks.length) return false;
  
  localStorage.setItem(TASKS_KEY, JSON.stringify(filteredTasks));
  return true;
};

export const searchTasks = (userId: string, query: string): Task[] => {
  const userTasks = getTasks(userId);
  const searchLower = query.toLowerCase();
  
  return userTasks.filter(task => 
    task.title.toLowerCase().includes(searchLower) ||
    task.description.toLowerCase().includes(searchLower) ||
    task.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

// Notification functions
export const getNotifications = (userId: string): Notification[] => {
  if (typeof window === 'undefined') return [];
  
  const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsData) return [];
  
  const allNotifications = JSON.parse(notificationsData);
  return allNotifications
    .filter((notification: Notification) => notification.userId === userId)
    .map((notification: Notification) => ({
      ...notification,
      createdAt: new Date(notification.createdAt),
    }))
    .sort((a: Notification, b: Notification) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt'>): Notification => {
  if (typeof window === 'undefined') throw new Error('Cannot add notification on server');
  
  const newNotification: Notification = {
    ...notificationData,
    id: uuidv4(),
    createdAt: new Date(),
  };
  
  const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
  const allNotifications = notificationsData ? JSON.parse(notificationsData) : [];
  
  allNotifications.push(newNotification);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
  
  return newNotification;
};

export const markNotificationAsRead = (notificationId: string): void => {
  if (typeof window === 'undefined') return;
  
  const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsData) return;
  
  const allNotifications = JSON.parse(notificationsData);
  const notificationIndex = allNotifications.findIndex((n: Notification) => n.id === notificationId);
  
  if (notificationIndex !== -1) {
    allNotifications[notificationIndex].read = true;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifications));
  }
};

export const markAllNotificationsAsRead = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  const notificationsData = localStorage.getItem(NOTIFICATIONS_KEY);
  if (!notificationsData) return;
  
  const allNotifications = JSON.parse(notificationsData);
  const updatedNotifications = allNotifications.map((notification: Notification) => 
    notification.userId === userId ? { ...notification, read: true } : notification
  );
  
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
};

// Analytics functions
export const getTaskAnalytics = (userId: string, days: number = 30) => {
  const tasks = getTasks(userId);
  const now = new Date();
  const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
  
  const filteredTasks = tasks.filter(task => task.createdAt >= startDate);
  
  const completed = filteredTasks.filter(task => task.status === 'completed').length;
  const pending = filteredTasks.filter(task => task.status !== 'completed').length;
  const overdue = filteredTasks.filter(task => 
    task.status !== 'completed' && task.dueDate < now
  ).length;
  
  // Tasks by priority
  const byPriority = {
    high: filteredTasks.filter(task => task.priority === 'high').length,
    medium: filteredTasks.filter(task => task.priority === 'medium').length,
    low: filteredTasks.filter(task => task.priority === 'low').length,
  };
  
  // Tasks by day (for charts)
  const tasksByDay: { [key: string]: { completed: number; created: number } } = {};
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dateKey = date.toISOString().split('T')[0];
    
    tasksByDay[dateKey] = {
      completed: filteredTasks.filter(task => 
        task.completedAt && 
        task.completedAt.toISOString().split('T')[0] === dateKey
      ).length,
      created: filteredTasks.filter(task => 
        task.createdAt.toISOString().split('T')[0] === dateKey
      ).length,
    };
  }
  
  return {
    total: filteredTasks.length,
    completed,
    pending,
    overdue,
    completionRate: filteredTasks.length > 0 ? (completed / filteredTasks.length) * 100 : 0,
    byPriority,
    tasksByDay: Object.entries(tasksByDay).reverse().map(([date, data]) => ({
      date,
      ...data,
    })),
  };
};

// Check for due tasks and create notifications
export const checkDueTasks = (userId: string): void => {
  if (typeof window === 'undefined') return;
  
  const tasks = getTasks(userId);
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
  const dueSoonTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    task.dueDate <= tomorrow && 
    task.dueDate > now
  );
  
  const overdueTasks = tasks.filter(task => 
    task.status !== 'completed' && 
    task.dueDate < now
  );
  
  // Check if we already sent notifications for these tasks today
  const existingNotifications = getNotifications(userId);
  const today = now.toISOString().split('T')[0];
  const sentToday = existingNotifications.filter(n => 
    n.createdAt.toISOString().split('T')[0] === today
  );
  
  dueSoonTasks.forEach(task => {
    const alreadySent = sentToday.some(n => 
      n.taskId === task.id && n.type === 'task_due'
    );
    
    if (!alreadySent) {
      addNotification({
        userId,
        title: 'Tarefa vencendo em breve',
        message: `A tarefa "${task.title}" vence amanhã`,
        read: false,
        type: 'task_due',
        taskId: task.id,
      });
    }
  });
  
  overdueTasks.forEach(task => {
    const alreadySent = sentToday.some(n => 
      n.taskId === task.id && n.type === 'task_due'
    );
    
    if (!alreadySent) {
      addNotification({
        userId,
        title: 'Tarefa em atraso',
        message: `A tarefa "${task.title}" está atrasada`,
        read: false,
        type: 'task_due',
        taskId: task.id,
      });
    }
  });
};

// Clear all data (for settings page)
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(TASKS_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(NOTIFICATIONS_KEY);
  localStorage.removeItem(INITIALIZED_KEY);
};