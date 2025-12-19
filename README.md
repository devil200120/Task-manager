# 🧑‍💻 Collaborative Task Manager

A modern, full-stack task management application built with React, TypeScript, Node.js, Express, and MongoDB. Features real-time collaboration using Socket.io, secure authentication, and a beautiful responsive UI.

## 🎯 Features

### Core Functionality
- ✅ **User Authentication & Authorization**
  - Secure registration and login with bcrypt password hashing
  - JWT-based session management with HttpOnly cookies
  - Protected routes and API endpoints
  - User profile management

- ✅ **Task Management (CRUD)**
  - Create, read, update, and delete tasks
  - Task attributes: title, description, dueDate, priority, status, creator, assignee
  - Priority levels: Low, Medium, High, Urgent
  - Status tracking: To Do, In Progress, Review, Completed

- ✅ **Real-Time Collaboration**
  - Live task updates using Socket.io
  - Instant notifications when assigned to tasks
  - Real-time synchronization across all connected clients

- ✅ **User Dashboard**
  - Personal view of assigned tasks
  - View tasks created by user
  - Track overdue tasks
  - Filtering by status and priority
  - Sorting by due date

### Technical Highlights
- **Backend Architecture**: Clean service/repository pattern
- **Data Validation**: Zod DTOs for type-safe validation
- **Error Handling**: Consistent HTTP status codes and error responses
- **Real-Time**: Socket.io integration for instant updates
- **State Management**: SWR with optimistic updates
- **Responsive Design**: Mobile-first Tailwind CSS
- **Testing**: Unit tests for critical business logic

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Data Fetching** | SWR (with optimistic updates) |
| **Form Management** | React Hook Form + Zod |
| **Backend** | Node.js + Express + TypeScript |
| **Database** | MongoDB + Mongoose |
| **Real-Time** | Socket.io |
| **Authentication** | JWT + bcrypt |
| **Testing** | Jest |

## 📂 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & Socket.io configuration
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── dtos/           # Data Transfer Objects (Zod schemas)
│   │   ├── middleware/     # Authentication, validation, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── repositories/   # Data access layer
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic layer
│   │   ├── app.ts          # Express app setup
│   │   └── server.ts       # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable React components
    │   ├── contexts/       # React Context providers
    │   ├── hooks/          # Custom React hooks
    │   ├── lib/            # API client & Socket.io client
    │   ├── pages/          # Page components
    │   ├── types/          # TypeScript type definitions
    │   ├── App.tsx         # Main app component
    │   └── main.tsx        # Entry point
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    └── vite.config.ts
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/task-manager
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

6. **Run tests:**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

6. **Build for production:**
   ```bash
   npm run build
   ```

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated"
}
```

### Task Endpoints

#### Create Task
```http
POST /tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task manager app",
  "dueDate": "2024-12-31T23:59:59Z",
  "priority": "High",
  "status": "To Do",
  "assignedToId": "user_id_here"
}
```

#### Get All Tasks (with filters)
```http
GET /tasks?status=To Do&priority=High&sortBy=dueDate&sortOrder=asc
Authorization: Bearer <token>
```

Query Parameters:
- `status`: Filter by status
- `priority`: Filter by priority
- `assignedToId`: Filter by assigned user
- `creatorId`: Filter by creator
- `overdue`: true/false
- `sortBy`: dueDate, createdAt, priority, status
- `sortOrder`: asc, desc

#### Get Task by ID
```http
GET /tasks/:id
Authorization: Bearer <token>
```

#### Update Task
```http
PUT /tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "Urgent"
}
```

#### Delete Task
```http
DELETE /tasks/:id
Authorization: Bearer <token>
```

#### Get Dashboard
```http
GET /tasks/dashboard
Authorization: Bearer <token>
```

Returns:
- Tasks assigned to user
- Tasks created by user
- Overdue tasks

## 🏗️ Architecture & Design Decisions

### Why MongoDB?
- **Flexible Schema**: Task attributes can evolve without migrations
- **JSON-Native**: Seamless integration with Node.js/Express
- **Scalability**: Horizontal scaling with sharding for future growth
- **Developer Experience**: Mongoose provides excellent TypeScript support

### Service/Repository Pattern
The backend follows a clean architecture:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Abstract database operations
- **Models**: Define data schemas

This separation provides:
- Easy testing (mock repositories)
- Reusable business logic
- Clear separation of concerns
- Maintainable codebase

### JWT Authentication
- Tokens stored in HttpOnly cookies for security
- Also supported in Authorization headers for flexibility
- 7-day expiration with refresh capability
- bcrypt for password hashing (10 rounds)

### Socket.io Integration
Real-time features implemented at the service layer:
1. Task created/updated/deleted → Broadcast to all clients
2. Task assigned → Direct notification to assignee
3. Automatic reconnection handling
4. Authentication via JWT tokens

### SWR for Data Fetching
- Stale-While-Revalidate strategy for optimal UX
- Automatic revalidation and caching
- Optimistic updates for instant feedback
- Real-time sync with Socket.io events

## 🧪 Testing

The project includes unit tests for critical backend logic:

### Running Tests
```bash
cd backend
npm test
```

### Test Coverage
- Task creation validation
- Due date validation (future dates only)
- Authorization checks (creator/assignee permissions)
- Dashboard data aggregation
- Invalid input handling

### Test Examples
1. **Task Creation with Valid Data**
   - Validates successful task creation
   - Ensures all fields are properly saved

2. **Past Due Date Rejection**
   - Prevents creating tasks with past due dates
   - Returns appropriate error message

3. **Authorization Checks**
   - Only creator/assignee can update tasks
   - Only creator can delete tasks
   - Returns 403 for unauthorized access

## 🔄 Real-Time Features

### Event Types
1. **task:created** - New task broadcast to all users
2. **task:updated** - Task changes broadcast to all users
3. **task:deleted** - Task deletion broadcast to all users
4. **task:assigned** - Direct notification to assigned user

### Client-Side Handling
- Automatic UI updates via SWR mutation
- Toast notifications for assignments
- Optimistic updates for immediate feedback

## 🎨 UI/UX Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Loading States**: Skeleton screens during data fetching
- **Error Handling**: Clear error messages and validation
- **Accessibility**: Semantic HTML and keyboard navigation
- **Dark Mode Ready**: Color system supports theming

## 📦 Deployment

### Backend Deployment (Render/Railway)

1. **Create a new Web Service**
2. **Configure environment variables**:
   - `MONGODB_URI` (use MongoDB Atlas)
   - `JWT_SECRET` (generate secure random string)
   - `CLIENT_URL` (your frontend URL)
   - `NODE_ENV=production`

3. **Build command**: `npm install && npm run build`
4. **Start command**: `npm start`

### Frontend Deployment (Vercel/Netlify)

1. **Connect your repository**
2. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment variables**:
   - `VITE_API_URL` (your backend API URL)
   - `VITE_SOCKET_URL` (your backend Socket.io URL)

### Database (MongoDB Atlas)

1. **Create a cluster** on MongoDB Atlas
2. **Whitelist your deployment IPs**
3. **Get connection string** and update `MONGODB_URI`

## 🎁 Bonus Features

### Implemented
- ✅ **Optimistic UI Updates**: Instant feedback using SWR
- ✅ **TypeScript Throughout**: Full type safety
- ✅ **Clean Architecture**: Service/Repository pattern
- ✅ **Real-Time Sync**: Socket.io integration
- ✅ **Form Validation**: React Hook Form + Zod
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Loading States**: Skeleton screens

### Future Enhancements
- 🔄 Audit logging for task changes
- 🐳 Docker containerization
- 📧 Email notifications
- 📱 Progressive Web App (PWA)
- 🌙 Dark mode
- 📊 Analytics dashboard
- 🔍 Advanced search
- 📎 File attachments

## 🤝 Contributing

This is an assessment project, but feedback and suggestions are welcome!

## 📝 License

MIT License

## 👨‍💻 Author

Built with ❤️ for the Intershala Full-Stack Engineering Assessment

---

## 🔗 Important Links

- **Live Demo**: [Will be deployed]
- **API Documentation**: See above
- **GitHub Repository**: [Your repo URL]
- **Submission Form**: https://forms.gle/fv1uZuya2jQR4bK76

---

**Note**: Make sure to deploy the application and submit both frontend and backend URLs along with this repository link!
