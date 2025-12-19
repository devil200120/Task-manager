import { io, Socket } from 'socket.io-client';
import { Task } from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Socket.io client manager for real-time updates
 */
class SocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Connect to Socket.io server
   */
  connect(token: string): void {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    this.socket.connect();

    // Authenticate
    this.socket.emit('authenticate', token);

    // Handle authentication response
    this.socket.on('authenticated', (data) => {
      console.log('✅ Socket.io authenticated:', data.userId);
    });

    this.socket.on('authentication_error', (error) => {
      console.error('❌ Socket.io authentication failed:', error);
    });

    // Setup listeners
    this.setupListeners();
  }

  /**
   * Setup event listeners
   */
  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('task:created', (task: Task) => {
      this.emit('taskCreated', task);
    });

    this.socket.on('task:updated', (task: Task) => {
      this.emit('taskUpdated', task);
    });

    this.socket.on('task:deleted', (data: { taskId: string }) => {
      this.emit('taskDeleted', data);
    });

    this.socket.on('task:assigned', (data: { message: string; task: Task }) => {
      this.emit('taskAssigned', data);
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket.io connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket.io disconnected');
    });
  }

  /**
   * Add event listener
   */
  on(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return cleanup function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: (data: any) => void): void {
    this.listeners.get(event)?.delete(callback);
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => {
      callback(data);
    });
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();
