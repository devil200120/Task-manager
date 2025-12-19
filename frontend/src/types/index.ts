/**
 * Task Priority Enum
 */
export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

/**
 * Task Status Enum
 */
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed',
}

/**
 * User interface
 */
export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

/**
 * Task interface
 */
export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  creatorId: User | string; // Can be populated User object or just ID string
  assignedToId?: User | string | null; // Can be populated User object, just ID string, or null
  assignedTo?: User; // Alias for assignedToId when populated (for backwards compatibility)
  createdAt: string;
  updatedAt: string;
}

/**
 * Create Task DTO
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string; // Email address
  assignedToId?: string; // User ID (backend will use email if provided)
}

/**
 * Update Task DTO
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedTo?: string | null; // Email address
  assignedToId?: string | null; // User ID (backend will use email if provided)
}

/**
 * Register DTO
 */
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

/**
 * Login DTO
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Dashboard Data
 */
export interface DashboardData {
  assignedTasks: Task[];
  createdTasks: Task[];
  overdueTasks: Task[];
}

/**
 * Notification
 */
export interface Notification {
  _id: string;
  message: string;
  type: 'task_assigned' | 'task_created' | 'task_updated' | 'task_deleted' | 'task_completed';
  task?: string;
  createdAt: string;
  read: boolean;
}
