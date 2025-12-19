import mongoose from 'mongoose';
import User, { IUser } from '../models/User.model';

/**
 * User Repository - Data Access Layer for User operations
 * Handles all direct database operations for users
 */
export class UserRepository {
  /**
   * Create a new user in the database
   */
  async create(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await User.findById(id).select('-password');
  }

  /**
   * Find a user by ID including password (for authentication)
   */
  async findByIdWithPassword(id: string): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await User.findById(id);
  }

  /**
   * Update user information
   */
  async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return await User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await User.findByIdAndDelete(id);
    return result !== null;
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return user !== null;
  }

  /**
   * Search users by name or email
   */
  async searchUsers(query: string): Promise<IUser[]> {
    const regex = new RegExp(query, 'i'); // case-insensitive search
    return await User.find({
      $or: [
        { name: { $regex: regex } },
        { email: { $regex: regex } }
      ]
    })
    .select('name email')
    .limit(10)
    .sort({ name: 1 });
  }

  /**
   * Get all users
   */
  async findAll(): Promise<IUser[]> {
    return await User.find()
      .select('name email')
      .sort({ name: 1 });
  }
}

export default new UserRepository();
