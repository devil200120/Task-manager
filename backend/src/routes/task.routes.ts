import { Router } from 'express';
import TaskController from '../controllers/Task.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';

const router = Router();

// All task routes require authentication
router.use(authenticate);

/**
 * @route GET /api/tasks/dashboard
 * @desc Get user dashboard with assigned, created, and overdue tasks
 * @access Private
 */
router.get('/dashboard', (req, res) => TaskController.getDashboard(req, res));

/**
 * @route POST /api/tasks
 * @desc Create a new task
 * @access Private
 */
router.post('/', validate(CreateTaskDto), (req, res) => TaskController.createTask(req, res));

/**
 * @route GET /api/tasks
 * @desc Get all tasks with optional filters (status, priority, assignedToId, creatorId, overdue)
 * @access Private
 */
router.get('/', (req, res) => TaskController.getAllTasks(req, res));

/**
 * @route GET /api/tasks/:id
 * @desc Get task by ID
 * @access Private
 */
router.get('/:id', (req, res) => TaskController.getTaskById(req, res));

/**
 * @route PUT /api/tasks/:id
 * @desc Update task
 * @access Private (creator or assignee only)
 */
router.put('/:id', validate(UpdateTaskDto), (req, res) => TaskController.updateTask(req, res));

/**
 * @route DELETE /api/tasks/:id
 * @desc Delete task
 * @access Private (creator only)
 */
router.delete('/:id', (req, res) => TaskController.deleteTask(req, res));

export default router;
