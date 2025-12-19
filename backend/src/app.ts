import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import Database from './config/database';
import { initializeSocket } from './config/socket';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

/**
 * Express Application Setup
 */
class App {
  public app: Application;
  private httpServer;

  constructor() {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize Express middlewares
   */
  private initializeMiddlewares(): void {
    // CORS configuration
    this.app.use(
      cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
      })
    );

    // Body parsing
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Cookie parsing
    this.app.use(cookieParser());

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Initialize API routes
   */
  private initializeRoutes(): void {
    this.app.use('/api', routes);

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    });
  }

  /**
   * Initialize error handling middleware
   */
  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to database
      await Database.connect();

      // Initialize Socket.io
      initializeSocket(this.httpServer);
      console.log('✅ Socket.io initialized');

      // Start server
      const PORT = process.env.PORT || 5000;
      this.httpServer.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📝 API: http://localhost:${PORT}/api`);
        console.log(`🔌 Socket.io: ws://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }
}

export default App;
