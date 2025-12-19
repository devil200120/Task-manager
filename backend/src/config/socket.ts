import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import AuthService from '../services/Auth.service';

/**
 * Socket.io server configuration and event handlers
 * Handles real-time task updates and notifications
 */
export class SocketManager {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string>; // userId -> socketId

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
      },
    });

    this.connectedUsers = new Map();
    this.initializeSocketHandlers();
  }

  /**
   * Initialize Socket.io event handlers
   */
  private initializeSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', async (token: string) => {
        try {
          const userId = AuthService.verifyToken(token);
          this.connectedUsers.set(userId, socket.id);
          socket.data.userId = userId;
          socket.join(`user:${userId}`);
          console.log(`✅ User authenticated: ${userId}`);
          socket.emit('authenticated', { userId });
        } catch (error) {
          console.error('❌ Authentication failed:', error);
          socket.emit('authentication_error', { message: 'Invalid token' });
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        if (socket.data.userId) {
          this.connectedUsers.delete(socket.data.userId);
          console.log(`👋 User disconnected: ${socket.data.userId}`);
        }
        console.log(`🔌 Client disconnected: ${socket.id}`);
      });
    });
  }

  /**
   * Emit task created event to all connected clients
   */
  emitTaskCreated(task: any): void {
    this.io.emit('task:created', task);
  }

  /**
   * Emit task updated event to all connected clients
   */
  emitTaskUpdated(task: any): void {
    this.io.emit('task:updated', task);
  }

  /**
   * Emit task deleted event to all connected clients
   */
  emitTaskDeleted(taskId: string): void {
    this.io.emit('task:deleted', { taskId });
  }

  /**
   * Send task assignment notification to specific user
   */
  emitTaskAssigned(userId: string, task: any): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('task:assigned', {
        message: `You have been assigned a new task: ${task.title}`,
        task,
      });
    }
  }

  /**
   * Get Socket.io server instance
   */
  getIO(): SocketIOServer {
    return this.io;
  }
}

let socketManager: SocketManager | null = null;

/**
 * Initialize Socket.io server
 */
export const initializeSocket = (httpServer: HTTPServer): SocketManager => {
  socketManager = new SocketManager(httpServer);
  return socketManager;
};

/**
 * Get Socket.io manager instance
 */
export const getSocketManager = (): SocketManager => {
  if (!socketManager) {
    throw new Error('Socket.io not initialized');
  }
  return socketManager;
};
