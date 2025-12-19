import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RegisterUserDtoType, LoginUserDtoType, UpdateUserDtoType } from '../dtos';
import UserRepository from '../repositories/User.repository';
import { IUser } from '../models/User.model';

/**
 * Authentication Service - Business Logic Layer for User/Auth operations
 * Handles authentication, authorization, and user management
 */
export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   * Register a new user
   * @throws Error if email already exists or validation fails
   */
  async register(userData: RegisterUserDtoType): Promise<{ user: IUser; token: string }> {
    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const user = await UserRepository.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    return { user, token };
  }

  /**
   * Login user with email and password
   * @throws Error if credentials are invalid
   */
  async login(credentials: LoginUserDtoType): Promise<{ user: IUser; token: string }> {
    // Find user by email
    const user = await UserRepository.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user._id.toString());

    // Remove password from user object
    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject as IUser, token };
  }

  /**
   * Get user profile by ID
   * @throws Error if user not found
   */
  async getUserProfile(userId: string): Promise<IUser> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   * @throws Error if user not found
   */
  async updateUserProfile(userId: string, updateData: UpdateUserDtoType): Promise<IUser> {
    const user = await UserRepository.update(userId, updateData);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Verify JWT token and return user ID
   * @throws Error if token is invalid
   */
  verifyToken(token: string): string {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Generate JWT token for user
   */
  private generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }
}

export default new AuthService();
