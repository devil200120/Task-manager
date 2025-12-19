import { Router } from 'express';
import UserController from '../controllers/User.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * User Routes
 * All routes require authentication
 */

// Search users by name or email
router.get('/search', authenticate, UserController.searchUsers.bind(UserController));

// Get all users
router.get('/', authenticate, UserController.getAllUsers.bind(UserController));

export default router;
