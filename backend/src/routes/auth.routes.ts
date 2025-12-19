import { Router } from 'express';
import AuthController from '../controllers/Auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from '../dtos';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validate(RegisterUserDto), (req, res) => AuthController.register(req, res));

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validate(LoginUserDto), (req, res) => AuthController.login(req, res));

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @access Public
 */
router.post('/logout', (req, res) => AuthController.logout(req, res));

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, (req, res) => AuthController.getMe(req, res));

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authenticate, validate(UpdateUserDto), (req, res) => 
  AuthController.updateProfile(req, res)
);

export default router;
