# 🧑‍💻 Collaborative Task Manager

A modern, production-ready, full-stack Task Management application built for real-time collaboration. This project demonstrates expertise in full-stack development using React, TypeScript, Node.js, Express, MongoDB, and Socket.io.

![Task Manager](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248)
![Socket.io](https://img.shields.io/badge/Socket.io-4.6-black)

## 🌐 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app) |
| **Backend API** | [https://your-backend-url.onrender.com](https://your-backend-url.onrender.com) |

> **Note**: Replace the above URLs with your actual deployed URLs before submission.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#️-tech-stack)
3. [Architecture Overview](#️-architecture-overview)
4. [Project Structure](#-project-structure)
5. [Setup Instructions](#-setup-instructions)
6. [API Documentation](#-api-documentation)
7. [Real-Time Implementation](#-real-time-implementation-socketio)
8. [Database Design](#-database-design)
9. [Testing](#-testing)
10. [Deployment](#-deployment)
11. [Design Decisions & Trade-offs](#-design-decisions--trade-offs)
12. [Bonus Features](#-bonus-features)

---

## ✨ Features

### 1. User Authentication & Authorization ✅
- **Secure Registration & Login**: Password hashing using bcrypt (10 rounds)
- **JWT Session Management**: Tokens stored in HttpOnly cookies for XSS protection
- **Protected Routes**: Middleware-based authentication on all private endpoints
- **User Profiles**: View and update personal information

### 2. Task Management (CRUD) ✅
Complete CRUD operations with the following task attributes:
| Attribute | Type | Description |
|-----------|------|-------------|
| `title` | String (max 100 chars) | Task title |
| `description` | String (multi-line) | Detailed description |
| `dueDate` | DateTime | Task deadline |
| `priority` | Enum | Low, Medium, High, Urgent |
| `status` | Enum | To Do, In Progress, Review, Completed |
| `creatorId` | ObjectId | User who created the task |
| `assignedToId` | ObjectId | User responsible for the task |

### 3. Real-Time Collaboration ✅
- **Live Updates**: Instant synchronization when any user updates tasks
- **Assignment Notifications**: In-app notifications when tasks are assigned
- **Persistent Notifications**: Notification history with read/unread status
- **Online Presence**: Connected users tracked in real-time

### 4. User Dashboard & Data Exploration ✅
- **Personal Views**: 
  - Tasks assigned to current user
  - Tasks created by current user  
  - Overdue tasks (past due date)
- **Filtering**: By Status and Priority
- **Sorting**: By Due Date, Created Date, Priority
- **Search**: Full-text search across task titles and descriptions

---

## 🛠️ Tech Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React 18 + Vite + TypeScript | Fast build times, excellent DX, type safety |
| **Styling** | Tailwind CSS | Utility-first, responsive, rapid development |
| **Data Fetching** | SWR | Stale-while-revalidate, caching, optimistic updates |
| **Form Management** | React Hook Form + Zod | Performance, validation, type inference |
| **Backend** | Node.js + Express + TypeScript | Robust, scalable, excellent Socket.io support |
| **Database** | MongoDB + Mongoose | Flexible schema, great for tasks with varying attributes |
| **Real-Time** | Socket.io | Reliable WebSocket with fallbacks |
| **Testing** | Jest | Industry standard, excellent TypeScript support |

---

## 🏗️ Architecture Overview

### Backend Architecture Pattern: Service/Repository

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MIDDLEWARE LAYER                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │    CORS      │  │     Auth     │  │   Validation (Zod)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONTROLLER LAYER                           │
│         Handles HTTP requests, response formatting              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ AuthController│  │TaskController│  │   UserController     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│         Business logic, validation, Socket.io events            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  AuthService │  │ TaskService  │  │   NotificationSvc    │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     REPOSITORY LAYER                            │
│              Data access abstraction (Mongoose)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  UserRepo    │  │  TaskRepo    │  │ NotificationRepo     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
│                      MongoDB Atlas                              │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          PAGES                                  │
│  Dashboard │ Tasks │ CreateTask │ TaskDetail │ Profile │ Auth   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       COMPONENTS                                │
│  Navbar │ TaskModal │ TaskCard │ Toast │ UserSearchDropdown     │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HOOKS & CONTEXT                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  useTasks    │  │  useAuth     │  │  useNotifications    │  │
│  │  (SWR)       │  │  (Context)   │  │  (Socket.io)         │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API & SOCKET                               │
│  ┌──────────────────────┐  ┌────────────────────────────────┐  │
│  │    API Client        │  │      Socket.io Client          │  │
│  │  (Fetch + SWR)       │  │    (Real-time events)          │  │
│  └──────────────────────┘  └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts          # MongoDB connection
│   │   │   └── socket.ts            # Socket.io configuration
│   │   ├── controllers/
│   │   │   ├── Auth.controller.ts   # Authentication endpoints
│   │   │   ├── Task.controller.ts   # Task CRUD endpoints
│   │   │   └── User.controller.ts   # User management
│   │   ├── dtos/
│   │   │   └── index.ts             # Zod validation schemas
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts   # JWT verification
│   │   │   ├── error.middleware.ts  # Global error handler
│   │   │   └── validation.middleware.ts
│   │   ├── models/
│   │   │   ├── User.model.ts        # User schema
│   │   │   ├── Task.model.ts        # Task schema
│   │   │   └── Notification.model.ts
│   │   ├── repositories/
│   │   │   ├── User.repository.ts   # User data access
│   │   │   ├── Task.repository.ts   # Task data access
│   │   │   └── Notification.repository.ts
│   │   ├── routes/
│   │   │   ├── index.ts             # Route aggregator
│   │   │   ├── auth.routes.ts       # Auth routes
│   │   │   ├── task.routes.ts       # Task routes
│   │   │   └── user.routes.ts       # User routes
│   │   ├── services/
│   │   │   ├── Auth.service.ts      # Auth business logic
│   │   │   ├── Task.service.ts      # Task business logic
│   │   │   └── Task.service.test.ts # Unit tests
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Entry point
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── TaskModal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── UserSearchDropdown.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx      # Auth state management
│   │   ├── hooks/
│   │   │   ├── useTasks.ts          # SWR task fetching
│   │   │   └── useNotifications.ts  # Real-time notifications
│   │   ├── lib/
│   │   │   ├── api.ts               # API client
│   │   │   └── socket.ts            # Socket.io client
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Tasks.tsx
│   │   │   ├── CreateTask.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── docker-compose.yml               # Full stack containerization
├── package.json                     # Workspace scripts
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Git**

### Quick Start (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/task-manager.git
cd task-manager

# Run setup script (Windows)
.\setup.bat

# OR Run setup script (Mac/Linux)
chmod +x setup.sh && ./setup.sh
```

### Manual Setup

#### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
```

**Backend `.env` Configuration:**
```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/task-manager

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
```

```bash
# Start development server
npm run dev
```

Backend runs on: `http://localhost:5000`

#### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Frontend `.env` Configuration:**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

```bash
# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Docker Setup (Bonus)

```bash
# Start entire stack with Docker
docker-compose up --build

# Services:
# - Frontend: http://localhost
# - Backend: http://localhost:5000
# - MongoDB: localhost:27017
```

---

## 📡 API Documentation

### Base URL
```
Production: https://your-backend-url.onrender.com/api
Development: http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201 Created):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout
```http
POST /api/auth/logout

Response (200 OK):
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "name": "John Updated"
}

Response (200 OK):
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { "user": { ... } }
}
```

### Task Endpoints

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

Request Body:
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README with API docs",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "priority": "High",
  "status": "To Do",
  "assignedTo": "colleague@example.com"  // Email of user to assign
}

Response (201 Created):
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Complete project documentation",
      "description": "Write comprehensive README with API docs",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "priority": "High",
      "status": "To Do",
      "creatorId": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
      "assignedToId": { "_id": "...", "name": "Jane", "email": "colleague@example.com" },
      "createdAt": "2024-12-19T10:00:00.000Z",
      "updatedAt": "2024-12-19T10:00:00.000Z"
    }
  }
}
```

#### Get All Tasks (with Filters & Sorting)
```http
GET /api/tasks?status=To Do&priority=High&sortBy=dueDate&sortOrder=asc
Authorization: Bearer <token>

Query Parameters:
- status: "To Do" | "In Progress" | "Review" | "Completed"
- priority: "Low" | "Medium" | "High" | "Urgent"
- assignedToId: User ID
- creatorId: User ID
- overdue: "true" | "false"
- sortBy: "dueDate" | "createdAt" | "priority" | "status"
- sortOrder: "asc" | "desc"

Response (200 OK):
{
  "success": true,
  "data": {
    "tasks": [ ... ]
  }
}
```

#### Get Task by ID
```http
GET /api/tasks/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "task": { ... }
  }
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

Request Body (all fields optional):
{
  "title": "Updated title",
  "status": "In Progress",
  "priority": "Urgent",
  "assignedTo": "newassignee@example.com"
}

Response (200 OK):
{
  "success": true,
  "message": "Task updated successfully",
  "data": { "task": { ... } }
}

Note: Only task creator or assignee can update a task.
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "message": "Task deleted successfully"
}

Note: Only task creator can delete a task.
```

#### Get Dashboard
```http
GET /api/tasks/dashboard
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "assignedTasks": [ ... ],  // Tasks assigned to current user
    "createdTasks": [ ... ],   // Tasks created by current user
    "overdueTasks": [ ... ]    // Tasks past due date
  }
}
```

### User Endpoints

#### Search Users
```http
GET /api/users/search?q=john
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "users": [
      { "id": "...", "name": "John Doe", "email": "john@example.com" }
    ]
  }
}
```

#### Get All Users
```http
GET /api/users
Authorization: Bearer <token>

Response (200 OK):
{
  "success": true,
  "data": {
    "users": [ ... ]
  }
}
```

### Error Responses

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Not authorized for this action |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]  // Optional validation errors
}
```

---

## 🔄 Real-Time Implementation (Socket.io)

### Architecture

```
┌──────────────────┐         ┌──────────────────┐
│   Frontend       │◄───────►│    Backend       │
│   Socket.io      │ WebSocket│    Socket.io     │
│   Client         │         │    Server        │
└──────────────────┘         └──────────────────┘
        │                            │
        │    1. Connect              │
        │──────────────────────────►│
        │                            │
        │    2. Authenticate (JWT)   │
        │──────────────────────────►│
        │                            │
        │    3. Join user room       │
        │◄──────────────────────────│
        │                            │
        │    4. Real-time events     │
        │◄─────────────────────────►│
        │                            │
```

### Socket Events

#### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `authenticate` | `token: string` | Authenticate user with JWT |

#### Server → Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `authenticated` | `{ userId }` | Authentication successful |
| `authentication_error` | `{ message }` | Authentication failed |
| `task:created` | `Task` | New task created |
| `task:updated` | `Task` | Task updated |
| `task:deleted` | `{ taskId }` | Task deleted |
| `task:assigned` | `{ message, task }` | Task assigned to user (direct) |

### Implementation Details

**Backend (socket.ts):**
```typescript
// Socket.io events are emitted from the service layer
export class SocketManager {
  // Broadcast to all connected clients
  emitTaskCreated(task: any): void {
    this.io.emit('task:created', task);
  }

  // Send notification to specific user
  emitTaskAssigned(userId: string, task: any): void {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('task:assigned', {
        message: `You have been assigned: ${task.title}`,
        task,
      });
    }
  }
}
```

**Frontend (socket.ts):**
```typescript
// Socket client with reconnection handling
export const socketClient = {
  connect() {
    this.socket = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
  },

  authenticate(token: string) {
    this.socket?.emit('authenticate', token);
  },

  on(event: string, callback: Function) {
    this.socket?.on(event, callback);
    return () => this.socket?.off(event, callback);
  }
};
```

**Frontend (useTasks.ts) - Real-time Sync:**
```typescript
useEffect(() => {
  // Listen for real-time updates and revalidate SWR cache
  const unsubscribe = socketClient.on('taskCreated', () => {
    mutate('/tasks/dashboard');
  });

  return () => unsubscribe();
}, []);
```

---

## 💾 Database Design

### Why MongoDB?

1. **Flexible Schema**: Tasks can have optional fields (assignee, custom attributes)
2. **JSON-Native**: Natural fit for JavaScript/TypeScript stack
3. **Scalability**: Horizontal scaling capabilities for future growth
4. **Mongoose ODM**: Excellent TypeScript support with schema validation
5. **Atlas**: Easy cloud deployment with free tier

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required, 2-50 chars),
  email: String (required, unique, indexed),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

#### Tasks Collection
```javascript
{
  _id: ObjectId,
  title: String (required, max 100 chars),
  description: String (required),
  dueDate: Date (required),
  priority: Enum ['Low', 'Medium', 'High', 'Urgent'],
  status: Enum ['To Do', 'In Progress', 'Review', 'Completed'],
  creatorId: ObjectId (ref: User, indexed),
  assignedToId: ObjectId (ref: User, indexed, optional),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- creatorId: 1
- assignedToId: 1
- status: 1
- dueDate: 1
```

#### Notifications Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  type: Enum ['task_assigned', 'task_updated', 'task_due'],
  title: String,
  message: String,
  taskId: ObjectId (ref: Task),
  read: Boolean (default: false),
  createdAt: Date
}
```

---

## 🧪 Testing

### Test Suite

The project includes **6 unit tests** for critical backend business logic using Jest:

```bash
# Run tests
cd backend
npm test

# Run with coverage
npm test -- --coverage
```

### Test Cases (Task.service.test.ts)

| Test | Description | Status |
|------|-------------|--------|
| 1 | Create task with valid data | ✅ Pass |
| 2 | Reject task with past due date | ✅ Pass |
| 3 | Reject task with invalid assignee ID | ✅ Pass |
| 4 | Update task by creator | ✅ Pass |
| 5 | Reject update by unauthorized user | ✅ Pass |
| 6 | Get dashboard data for user | ✅ Pass |

### Test Example

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should throw error when due date is in the past', async () => {
      const mockTaskData = {
        title: 'Test Task',
        description: 'Test Description',
        dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
      };

      await expect(
        TaskService.createTask(mockTaskData, 'userId')
      ).rejects.toThrow('Due date must be in the future');

      expect(TaskRepository.create).not.toHaveBeenCalled();
    });
  });
});
```

---

## 🚀 Deployment

### Backend Deployment (Render)

1. **Create a Web Service** on Render
2. **Connect GitHub repository**
3. **Configure:**
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. **Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-production-secret
   CLIENT_URL=https://your-frontend.vercel.app
   ```

### Frontend Deployment (Vercel)

1. **Import project** from GitHub
2. **Configure:**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```

### Database (MongoDB Atlas)

1. **Create free cluster** on MongoDB Atlas
2. **Create database user**
3. **Whitelist IP addresses** (0.0.0.0/0 for Render)
4. **Get connection string** and set as `MONGODB_URI`

---

## 💭 Design Decisions & Trade-offs

### 1. MongoDB vs PostgreSQL
**Choice:** MongoDB

**Reasoning:**
- Tasks have flexible attributes that may evolve
- JSON-native storage aligns with JavaScript stack
- Mongoose provides excellent TypeScript integration
- Free tier on Atlas sufficient for MVP

**Trade-off:** Less suited for complex relational queries

### 2. JWT in HttpOnly Cookies vs LocalStorage
**Choice:** HttpOnly Cookies

**Reasoning:**
- Protection against XSS attacks
- Automatic inclusion in requests
- Server-side logout capability

**Trade-off:** Requires CORS configuration, CSRF consideration

### 3. SWR vs React Query
**Choice:** SWR

**Reasoning:**
- Simpler API for this use case
- Built-in optimistic updates
- Lightweight bundle size
- Excellent caching strategy

**Trade-off:** React Query has more features for complex scenarios

### 4. Service/Repository Pattern
**Choice:** Full separation with DTOs

**Reasoning:**
- Clear separation of concerns
- Easy to test (mock repositories)
- Business logic isolated in services
- Data validation at DTO layer

**Trade-off:** More boilerplate code

### 5. Socket.io vs WebSocket API
**Choice:** Socket.io

**Reasoning:**
- Automatic reconnection
- Fallback to polling
- Room/namespace support
- Better browser compatibility

**Trade-off:** Larger bundle, not pure WebSocket

### Assumptions Made

1. Users have unique email addresses
2. Task due dates are in the future (enforced)
3. Only creator can delete tasks
4. Creator and assignee can update tasks
5. All authenticated users can view all tasks (for collaboration)

---

## 🎁 Bonus Features

### Implemented ✅

| Feature | Description |
|---------|-------------|
| **Optimistic UI** | SWR mutations update UI instantly before server confirmation |
| **TypeScript Throughout** | Full type safety on both frontend and backend |
| **Dockerization** | Complete `docker-compose.yml` for local development |
| **User Search** | Dynamic dropdown with debounced search for task assignment |
| **Countdown Timer** | Visual countdown on task cards showing time until due date |
| **Persistent Notifications** | In-app notification center with read/unread status |
| **Loading Skeletons** | Smooth loading states during data fetches |

### Future Enhancements 🔄

- Audit logging for task changes
- Email notifications
- File attachments
- Recurring tasks
- Team/Organization support
- Advanced analytics dashboard

---

## 👨‍💻 Author

Built with ❤️ for the Intershala Full-Stack Engineering Assessment

---

## 📝 License

MIT License - Feel free to use this project as a reference.

