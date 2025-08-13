import { create } from 'zustand';
import { 
  getTasks, 
  getSharedTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  searchTasks,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotification,
  checkDueTasks,
  getTaskAnalytics,
  getUser,
  updateUser,
  initializeStorage,
  type Task, 
  type User,
  type Notification
} from '@/lib/storage';

interface TaskState {
  // State
  tasks: Task[];
  sharedTasks: Task[];
  notifications: Notification[];
  user: User | null;
  loading: boolean;
  searchQuery: string;
  filters: {
    status: 'all' | 'todo' | 'in_progress' | 'completed';
    priority: 'all' | 'low' | 'medium' | 'high';
    tags: string[];
  };

  // Actions
  initialize: () => void;
  loadTasks: () => void;
  loadSharedTasks: () => void;
  loadNotifications: () => void;
  loadUser: () => void;
  createNewTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => Promise<Task>;
  updateExistingTask: (taskId: string, updates: Partial<Task>) => Promise<Task | null>;
  deleteExistingTask: (taskId: string) => Promise<boolean>;
  searchTasksQuery: (query: string) => Task[];
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  getFilteredTasks: () => Task[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  checkForDueTasks: () => void;
  getAnalytics: (days?: number) => ReturnType<typeof getTaskAnalytics>;
  updateUserProfile: (updates: Partial<User>) => void;
  refreshData: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  // Initial state
  tasks: [],
  sharedTasks: [],
  notifications: [],
  user: null,
  loading: false,
  searchQuery: '',
  filters: {
    status: 'all',
    priority: 'all',
    tags: [],
  },

  // Initialize storage and load data
  initialize: () => {
    initializeStorage();
    get().loadUser();
    get().loadTasks();
    get().loadSharedTasks();
    get().loadNotifications();
    get().checkForDueTasks();
  },

  // Load user's tasks
  loadTasks: () => {
    const user = get().user;
    if (!user) return;
    
    set({ loading: true });
    try {
      const tasks = getTasks(user.id);
      set({ tasks, loading: false });
    } catch (error) {
      console.error('Error loading tasks:', error);
      set({ loading: false });
    }
  },

  // Load shared tasks
  loadSharedTasks: () => {
    const user = get().user;
    if (!user) return;
    
    try {
      const sharedTasks = getSharedTasks(user.id);
      set({ sharedTasks });
    } catch (error) {
      console.error('Error loading shared tasks:', error);
    }
  },

  // Load notifications
  loadNotifications: () => {
    const user = get().user;
    if (!user) return;
    
    try {
      const notifications = getNotifications(user.id);
      set({ notifications });
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  },

  // Load user data
  loadUser: () => {
    try {
      const user = getUser();
      set({ user });
    } catch (error) {
      console.error('Error loading user:', error);
    }
  },

  // Create new task
  createNewTask: async (taskData) => {
    const user = get().user;
    if (!user) throw new Error('User not found');
    
    set({ loading: true });
    try {
      const newTask = createTask({
        ...taskData,
        ownerId: user.id,
        sharedWith: [],
      });
      
      get().loadTasks();
      set({ loading: false });
      return newTask;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Update existing task
  updateExistingTask: async (taskId, updates) => {
    set({ loading: true });
    try {
      const updatedTask = updateTask(taskId, updates);
      get().loadTasks();
      get().loadSharedTasks();
      set({ loading: false });
      return updatedTask;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Delete task
  deleteExistingTask: async (taskId) => {
    set({ loading: true });
    try {
      const success = deleteTask(taskId);
      if (success) {
        get().loadTasks();
        get().loadSharedTasks();
      }
      set({ loading: false });
      return success;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // Search tasks
  searchTasksQuery: (query) => {
    const user = get().user;
    if (!user) return [];
    
    if (!query.trim()) return get().tasks;
    
    return searchTasks(user.id, query);
  },

  // Set search query
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  // Set filters
  setFilters: (newFilters) => {
    set({ 
      filters: { 
        ...get().filters, 
        ...newFilters 
      } 
    });
  },

  // Get filtered tasks
  getFilteredTasks: () => {
    const { tasks, filters, searchQuery } = get();
    let filteredTasks = [...tasks];

    // Apply search
    if (searchQuery.trim()) {
      filteredTasks = get().searchTasksQuery(searchQuery);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
    }

    // Apply tags filter
    if (filters.tags.length > 0) {
      filteredTasks = filteredTasks.filter(task => 
        filters.tags.some(tag => task.tags.includes(tag))
      );
    }

    return filteredTasks;
  },

  // Mark notification as read
  markNotificationRead: (notificationId) => {
    markNotificationAsRead(notificationId);
    get().loadNotifications();
  },

  // Mark all notifications as read
  markAllNotificationsRead: () => {
    const user = get().user;
    if (!user) return;
    
    markAllNotificationsAsRead(user.id);
    get().loadNotifications();
  },

  // Check for due tasks and create notifications
  checkForDueTasks: () => {
    const user = get().user;
    if (!user) return;
    
    checkDueTasks(user.id);
    get().loadNotifications();
  },

  // Get analytics data
  getAnalytics: (days = 30) => {
    const user = get().user;
    if (!user) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0,
        completionRate: 0,
        byPriority: { high: 0, medium: 0, low: 0 },
        tasksByDay: [],
      };
    }
    
    return getTaskAnalytics(user.id, days);
  },

  // Update user profile
  updateUserProfile: (updates) => {
    const user = get().user;
    if (!user) return;
    
    updateUser({ ...user, ...updates });
    get().loadUser();
  },

  // Refresh all data
  refreshData: () => {
    get().loadTasks();
    get().loadSharedTasks();
    get().loadNotifications();
    get().checkForDueTasks();
  },
}));