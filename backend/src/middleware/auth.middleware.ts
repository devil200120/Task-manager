import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/Auth.service';

/**
 * Extended Request interface to include userId
 */
export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Authentication Middleware
 * Verifies JWT token from cookies or Authorization header
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    // Verify token
    const userId = AuthService.verifyToken(token);
    req.userId = userId;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
