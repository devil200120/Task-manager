import { CreateTaskDtoType, UpdateTaskDtoType } from '../dtos';
import TaskRepository, { TaskFilterOptions, TaskSortOptions } from '../repositories/Task.repository';
import { ITask } from '../models/Task.model';
import UserRepository from '../repositories/User.repository';
import mongoose from 'mongoose';

/**
 * Task Service - Business Logic Layer for Task operations
 * Handles task creation, updates, deletion, and complex business logic
 */
export class TaskService {
  /**
   * Create a new task
   * @throws Error if validation fails or user not authorized
   */
  async createTask(taskData: CreateTaskDtoType, creatorId: string): Promise<ITask> {
    // Validate due date is in the future
    const dueDate = new Date(taskData.dueDate);
    if (dueDate < new Date()) {
      throw new Error('Due date must be in the future');
    }

    let assignedToId: mongoose.Types.ObjectId | undefined;

    // Handle assignedTo email lookup
    if (taskData.assignedTo && taskData.assignedTo.trim()) {
      const assignedUser = await UserRepository.findByEmail(taskData.assignedTo.trim());
      if (!assignedUser) {
        throw new Error(`User with email ${taskData.assignedTo} not found`);
      }
      assignedToId = assignedUser._id as mongoose.Types.ObjectId;
    } else if (taskData.assignedToId && taskData.assignedToId.trim()) {
      // Validate assignedToId if provided directly
      if (!mongoose.Types.ObjectId.isValid(taskData.assignedToId.trim())) {
        throw new Error('Invalid assigned user ID');
      }
      assignedToId = new mongoose.Types.ObjectId(taskData.assignedToId.trim());
    }

    const task = await TaskRepository.create({
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: taskData.status,
      dueDate,
      creatorId: new mongoose.Types.ObjectId(creatorId),
      assignedToId,
    });

    return task;
  }

  /**
   * Get task by ID
   * @throws Error if task not found
   */
  async getTaskById(taskId: string): Promise<ITask> {
    const task = await TaskRepository.findById(taskId);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  /**
   * Get all tasks with filters and sorting
   */
  async getAllTasks(filters: TaskFilterOptions = {}, sort?: TaskSortOptions): Promise<ITask[]> {
    return await TaskRepository.findAll(filters, sort);
  }

  /**
   * Update a task
   * @throws Error if task not found or user not authorized
   */
  async updateTask(
    taskId: string,
    updateData: UpdateTaskDtoType,
    userId: string
  ): Promise<{ task: ITask; previousAssignee?: string }> {
    // Get existing task
    const existingTask = await TaskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Check if user is creator or assignee
    // Handle both populated and non-populated references
    const creatorIdStr = typeof existingTask.creatorId === 'object' && existingTask.creatorId._id
      ? existingTask.creatorId._id.toString()
      : existingTask.creatorId.toString();
    
    const assignedToIdStr = existingTask.assignedToId
      ? (typeof existingTask.assignedToId === 'object' && existingTask.assignedToId._id
          ? existingTask.assignedToId._id.toString()
          : existingTask.assignedToId.toString())
      : undefined;
    
    const isCreator = creatorIdStr === userId;
    const isAssignee = assignedToIdStr === userId;
    
    if (!isCreator && !isAssignee) {
      throw new Error('Not authorized to update this task');
    }

    // Validate due date if provided
    if (updateData.dueDate) {
      const dueDate = new Date(updateData.dueDate);
      if (dueDate < new Date()) {
        throw new Error('Due date must be in the future');
      }
    }

    // Track previous assignee for notification
    const previousAssignee = existingTask.assignedToId?.toString();

    // Prepare update data
    const preparedUpdateData: any = {
      title: updateData.title,
      description: updateData.description,
      priority: updateData.priority,
      status: updateData.status,
    };

    if (updateData.dueDate) {
      preparedUpdateData.dueDate = new Date(updateData.dueDate);
    }

    // Handle assignedTo email lookup
    if (updateData.assignedTo !== undefined) {
      if (updateData.assignedTo === null || updateData.assignedTo === '') {
        preparedUpdateData.assignedToId = null;
      } else {
        const assignedUser = await UserRepository.findByEmail(updateData.assignedTo);
        if (!assignedUser) {
          throw new Error(`User with email ${updateData.assignedTo} not found`);
        }
        preparedUpdateData.assignedToId = assignedUser._id;
      }
    } else if (updateData.assignedToId !== undefined) {
      // Validate assignedToId if provided directly
      if (updateData.assignedToId !== null && !mongoose.Types.ObjectId.isValid(updateData.assignedToId)) {
        throw new Error('Invalid assigned user ID');
      }
      preparedUpdateData.assignedToId = updateData.assignedToId
        ? new mongoose.Types.ObjectId(updateData.assignedToId)
        : null;
    }

    const task = await TaskRepository.update(taskId, preparedUpdateData);
    if (!task) {
      throw new Error('Failed to update task');
    }

    return { task, previousAssignee };
  }

  /**
   * Delete a task
   * @throws Error if task not found or user not authorized
   */
  async deleteTask(taskId: string, userId: string): Promise<void> {
    // Get existing task
    const existingTask = await TaskRepository.findById(taskId);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    // Only creator can delete
    // Handle both populated and non-populated references
    const creatorIdStr = typeof existingTask.creatorId === 'object' && existingTask.creatorId._id
      ? existingTask.creatorId._id.toString()
      : existingTask.creatorId.toString();
    
    if (creatorIdStr !== userId) {
      throw new Error('Not authorized to delete this task');
    }

    const deleted = await TaskRepository.delete(taskId);
    if (!deleted) {
      throw new Error('Failed to delete task');
    }
  }

  /**
   * Get user's dashboard data
   */
  async getUserDashboard(userId: string): Promise<{
    assignedTasks: ITask[];
    createdTasks: ITask[];
    overdueTasks: ITask[];
  }> {
    const [assignedTasks, createdTasks, overdueTasks] = await Promise.all([
      TaskRepository.findByAssignedUser(userId),
      TaskRepository.findByCreator(userId),
      TaskRepository.findOverdueTasks(userId),
    ]);

    return {
      assignedTasks,
      createdTasks,
      overdueTasks,
    };
  }
}

export default new TaskService();
