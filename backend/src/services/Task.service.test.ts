import TaskService from '../services/Task.service';
import TaskRepository from '../repositories/Task.repository';
import { TaskStatus, TaskPriority } from '../models/Task.model';
import { CreateTaskDtoType } from '../dtos';

// Mock the TaskRepository
jest.mock('../repositories/Task.repository');

describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    /**
     * Test 1: Successfully create a task with valid data
     */
    it('should create a task successfully with valid data', async () => {
      const mockTaskData: CreateTaskDtoType = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        assignedToId: '507f1f77bcf86cd799439011',
      };

      const mockCreatedTask = {
        _id: '507f1f77bcf86cd799439012',
        ...mockTaskData,
        dueDate: new Date(mockTaskData.dueDate),
        creatorId: '507f1f77bcf86cd799439013',
      };

      (TaskRepository.create as jest.Mock).mockResolvedValue(mockCreatedTask);

      const result = await TaskService.createTask(mockTaskData, '507f1f77bcf86cd799439013');

      expect(TaskRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedTask);
      expect(result.title).toBe(mockTaskData.title);
    });

    /**
     * Test 2: Reject task creation with past due date
     */
    it('should throw error when due date is in the past', async () => {
      const mockTaskData: CreateTaskDtoType = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      };

      await expect(
        TaskService.createTask(mockTaskData, '507f1f77bcf86cd799439013')
      ).rejects.toThrow('Due date must be in the future');

      expect(TaskRepository.create).not.toHaveBeenCalled();
    });

    /**
     * Test 3: Reject task creation with invalid assignee ID
     */
    it('should throw error when assignedToId is invalid', async () => {
      const mockTaskData: CreateTaskDtoType = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        assignedToId: 'invalid-id',
      };

      await expect(
        TaskService.createTask(mockTaskData, '507f1f77bcf86cd799439013')
      ).rejects.toThrow('Invalid assigned user ID');

      expect(TaskRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateTask', () => {
    /**
     * Test 4: Successfully update task by creator
     */
    it('should update task successfully when user is creator', async () => {
      const taskId = '507f1f77bcf86cd799439012';
      const userId = '507f1f77bcf86cd799439013';

      const existingTask = {
        _id: taskId,
        title: 'Old Title',
        description: 'Old Description',
        dueDate: new Date(Date.now() + 86400000),
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        creatorId: { toString: () => userId },
        assignedToId: null,
      };

      const updateData = {
        title: 'Updated Title',
        priority: TaskPriority.HIGH,
      };

      const updatedTask = {
        ...existingTask,
        ...updateData,
      };

      (TaskRepository.findById as jest.Mock).mockResolvedValue(existingTask);
      (TaskRepository.update as jest.Mock).mockResolvedValue(updatedTask);

      const result = await TaskService.updateTask(taskId, updateData, userId);

      expect(result.task.title).toBe('Updated Title');
      expect(result.task.priority).toBe(TaskPriority.HIGH);
      expect(TaskRepository.update).toHaveBeenCalledTimes(1);
    });

    /**
     * Test 5: Reject update when user is not authorized
     */
    it('should throw error when user is not creator or assignee', async () => {
      const taskId = '507f1f77bcf86cd799439012';
      const userId = '507f1f77bcf86cd799439013';
      const unauthorizedUserId = '507f1f77bcf86cd799439014';

      const existingTask = {
        _id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(Date.now() + 86400000),
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        creatorId: { toString: () => userId },
        assignedToId: null,
      };

      (TaskRepository.findById as jest.Mock).mockResolvedValue(existingTask);

      await expect(
        TaskService.updateTask(taskId, { title: 'New Title' }, unauthorizedUserId)
      ).rejects.toThrow('Not authorized to update this task');

      expect(TaskRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('getUserDashboard', () => {
    /**
     * Test 6: Successfully retrieve user dashboard data
     */
    it('should return assigned, created, and overdue tasks', async () => {
      const userId = '507f1f77bcf86cd799439013';

      const mockAssignedTasks = [
        {
          _id: '1',
          title: 'Assigned Task 1',
          status: TaskStatus.IN_PROGRESS,
        },
      ];

      const mockCreatedTasks = [
        {
          _id: '2',
          title: 'Created Task 1',
          status: TaskStatus.TODO,
        },
      ];

      const mockOverdueTasks = [
        {
          _id: '3',
          title: 'Overdue Task 1',
          dueDate: new Date(Date.now() - 86400000),
          status: TaskStatus.TODO,
        },
      ];

      (TaskRepository.findByAssignedUser as jest.Mock).mockResolvedValue(mockAssignedTasks);
      (TaskRepository.findByCreator as jest.Mock).mockResolvedValue(mockCreatedTasks);
      (TaskRepository.findOverdueTasks as jest.Mock).mockResolvedValue(mockOverdueTasks);

      const result = await TaskService.getUserDashboard(userId);

      expect(result.assignedTasks).toEqual(mockAssignedTasks);
      expect(result.createdTasks).toEqual(mockCreatedTasks);
      expect(result.overdueTasks).toEqual(mockOverdueTasks);
      expect(TaskRepository.findByAssignedUser).toHaveBeenCalledWith(userId);
      expect(TaskRepository.findByCreator).toHaveBeenCalledWith(userId);
      expect(TaskRepository.findOverdueTasks).toHaveBeenCalledWith(userId);
    });
  });
});
