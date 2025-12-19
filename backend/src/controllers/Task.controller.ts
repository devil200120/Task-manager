import { Response } from 'express';
import TaskService from '../services/Task.service';
import { CreateTaskDtoType, UpdateTaskDtoType } from '../dtos';
import { AuthRequest } from '../middleware/auth.middleware';
import { TaskStatus, TaskPriority } from '../models/Task.model';
import { getSocketManager } from '../config/socket';

/**
 * Task Controller - Handles HTTP requests for task management
 */
export class TaskController {
  /**
   * Create a new task
   * POST /api/tasks
   */
  async createTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const taskData: CreateTaskDtoType = req.body;
      const task = await TaskService.createTask(taskData, req.userId);

      // Emit real-time event for task creation
      const socketManager = getSocketManager();
      socketManager.emitTaskCreated(task);

      // If task is assigned, notify the assignee
      if (task.assignedToId) {
        socketManager.emitTaskAssigned(task.assignedToId.toString(), task);
      }

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create task',
      });
    }
  }

  /**
   * Get all tasks with optional filters
   * GET /api/tasks
   */
  async getAllTasks(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status, priority, assignedToId, creatorId, overdue, sortBy, sortOrder } = req.query;

      const filters: any = {};
      if (status) filters.status = status as TaskStatus;
      if (priority) filters.priority = priority as TaskPriority;
      if (assignedToId) filters.assignedToId = assignedToId as string;
      if (creatorId) filters.creatorId = creatorId as string;
      if (overdue === 'true') filters.overdue = true;

      const sort: any = {};
      if (sortBy) {
        sort.field = sortBy as 'dueDate' | 'createdAt' | 'priority' | 'status';
        sort.order = sortOrder === 'desc' ? 'desc' : 'asc';
      }

      const tasks = await TaskService.getAllTasks(filters, sort);

      res.status(200).json({
        success: true,
        data: { tasks, count: tasks.length },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch tasks',
      });
    }
  }

  /**
   * Get task by ID
   * GET /api/tasks/:id
   */
  async getTaskById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const task = await TaskService.getTaskById(id);

      res.status(200).json({
        success: true,
        data: { task },
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'Task not found',
      });
    }
  }

  /**
   * Update task
   * PUT /api/tasks/:id
   */
  async updateTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const updateData: UpdateTaskDtoType = req.body;
      const result = await TaskService.updateTask(id, updateData, req.userId);

      // Emit real-time event for task update
      const socketManager = getSocketManager();
      socketManager.emitTaskUpdated(result.task);

      // If assignee changed, notify new assignee
      if (updateData.assignedToId && 
          updateData.assignedToId !== result.previousAssignee) {
        socketManager.emitTaskAssigned(updateData.assignedToId, result.task);
      }

      res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: { 
          task: result.task,
          previousAssignee: result.previousAssignee 
        },
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not authorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update task',
      });
    }
  }

  /**
   * Delete task
   * DELETE /api/tasks/:id
   */
  async deleteTask(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const { id } = req.params;
      await TaskService.deleteTask(id, req.userId);

      // Emit real-time event for task deletion
      const socketManager = getSocketManager();
      socketManager.emitTaskDeleted(id);

      res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error) {
      const statusCode = error instanceof Error && error.message.includes('not authorized') ? 403 : 400;
      res.status(statusCode).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete task',
      });
    }
  }

  /**
   * Get user dashboard data
   * GET /api/tasks/dashboard
   */
  async getDashboard(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({
          success: false,
          message: 'Not authenticated',
        });
        return;
      }

      const dashboard = await TaskService.getUserDashboard(req.userId);

      res.status(200).json({
        success: true,
        data: dashboard,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch dashboard',
      });
    }
  }
}

export default new TaskController();
