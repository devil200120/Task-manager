import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models/Task.model';

/**
 * DTO for user registration
 */
export const RegisterUserDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterUserDtoType = z.infer<typeof RegisterUserDto>;

/**
 * DTO for user login
 */
export const LoginUserDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginUserDtoType = z.infer<typeof LoginUserDto>;

/**
 * DTO for updating user profile
 */
export const UpdateUserDto = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
});

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;

/**
 * DTO for creating a new task
 */
export const CreateTaskDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required'),
  dueDate: z.string().datetime('Invalid date format'),
  priority: z.nativeEnum(TaskPriority, {
    errorMap: () => ({ message: 'Priority must be Low, Medium, High, or Urgent' }),
  }),
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: 'Status must be To Do, In Progress, Review, or Completed' }),
  }).optional(),
  assignedToId: z.string().optional(),
  assignedTo: z.string().email('Invalid email format').optional(), // Email fallback
});

export type CreateTaskDtoType = z.infer<typeof CreateTaskDto>;

/**
 * DTO for updating an existing task
 */
export const UpdateTaskDto = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  dueDate: z.string().datetime('Invalid date format').optional(),
  priority: z.nativeEnum(TaskPriority, {
    errorMap: () => ({ message: 'Priority must be Low, Medium, High, or Urgent' }),
  }).optional(),
  status: z.nativeEnum(TaskStatus, {
    errorMap: () => ({ message: 'Status must be To Do, In Progress, Review, or Completed' }),
  }).optional(),
  assignedToId: z.string().nullable().optional(),
  assignedTo: z.string().email('Invalid email format').nullable().optional(), // Email fallback
});

export type UpdateTaskDtoType = z.infer<typeof UpdateTaskDto>;
