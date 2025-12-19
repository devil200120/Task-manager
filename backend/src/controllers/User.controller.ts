import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import UserRepository from '../repositories/User.repository';

/**
 * User Controller - Handles HTTP requests for user management
 */
export class UserController {
  /**
   * Search users by name or email
   * GET /api/users/search?q=query
   */
  async searchUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
        return;
      }

      // Search users by name or email (case-insensitive)
      const users = await UserRepository.searchUsers(q.trim());

      res.status(200).json({
        success: true,
        data: { 
          users: users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
          }))
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search users',
      });
    }
  }

  /**
   * Get all users (for assignment dropdown)
   * GET /api/users
   */
  async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const users = await UserRepository.findAll();

      res.status(200).json({
        success: true,
        data: { 
          users: users.map(user => ({
            _id: user._id,
            name: user.name,
            email: user.email,
          }))
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch users',
      });
    }
  }
}

export default new UserController();
