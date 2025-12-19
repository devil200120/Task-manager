import mongoose from 'mongoose';
import Task, { ITask, TaskStatus, TaskPriority } from '../models/Task.model';

/**
 * Filter options for task queries
 */
export interface TaskFilterOptions {
  creatorId?: string;
  assignedToId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  overdue?: boolean;
}

/**
 * Sort options for task queries
 */
export interface TaskSortOptions {
  field: 'dueDate' | 'createdAt' | 'priority' | 'status';
  order: 'asc' | 'desc';
}

/**
 * Task Repository - Data Access Layer for Task operations
 * Handles all direct database operations for tasks
 */
export class TaskRepository {
  /**
   * Create a new task in the database
   */
  async create(taskData: Partial<ITask>): Promise<ITask> {
    const task = new Task(taskData);
    return await task.save();
  }

  /**
   * Find a task by ID with populated references
   */
  async findById(id: string): Promise<ITask | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Task.findById(id)
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  /**
   * Find all tasks with optional filtering and sorting
   */
  async findAll(
    filters: TaskFilterOptions = {},
    sort: TaskSortOptions = { field: 'dueDate', order: 'asc' }
  ): Promise<ITask[]> {
    const query: any = {};

    if (filters.creatorId) {
      query.creatorId = filters.creatorId;
    }

    if (filters.assignedToId !== undefined) {
      query.assignedToId = filters.assignedToId || null;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.overdue) {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: TaskStatus.COMPLETED };
    }

    const sortOrder = sort.order === 'asc' ? 1 : -1;
    const sortObj: any = { [sort.field]: sortOrder };

    return await Task.find(query)
      .sort(sortObj)
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  /**
   * Update a task
   */
  async update(id: string, taskData: Partial<ITask>): Promise<ITask | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await Task.findByIdAndUpdate(id, taskData, { new: true })
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email');
  }

  /**
   * Delete a task
   */
  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Task.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Get tasks assigned to a specific user
   */
  async findByAssignedUser(userId: string): Promise<ITask[]> {
    return await Task.find({ assignedToId: userId })
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email')
      .sort({ dueDate: 1 });
  }

  /**
   * Get tasks created by a specific user
   */
  async findByCreator(userId: string): Promise<ITask[]> {
    return await Task.find({ creatorId: userId })
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email')
      .sort({ dueDate: 1 });
  }

  /**
   * Get overdue tasks for a user
   */
  async findOverdueTasks(userId?: string): Promise<ITask[]> {
    const query: any = {
      dueDate: { $lt: new Date() },
      status: { $ne: TaskStatus.COMPLETED },
    };

    if (userId) {
      query.$or = [{ creatorId: userId }, { assignedToId: userId }];
    }

    return await Task.find(query)
      .populate('creatorId', 'name email')
      .populate('assignedToId', 'name email')
      .sort({ dueDate: 1 });
  }
}

export default new TaskRepository();
