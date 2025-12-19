# 🧪 API Testing Guide

This guide helps you test all API endpoints manually using tools like Postman, Insomnia, or curl.

## 🔧 Setup

### Base URL
```
Local: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

### Headers
All authenticated requests need:
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📍 Endpoints

### 1. Health Check

**GET** `/health`

Test if API is running.

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Register User

**POST** `/auth/register`

Create a new user account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**curl Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

### 3. Login

**POST** `/auth/login`

Authenticate and get token.

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Save the token** for subsequent requests!

---

### 4. Get Current User

**GET** `/auth/me`

Get logged-in user details.

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**curl Example:**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. Update Profile

**PUT** `/auth/profile`

Update user profile.

**Request:**
```json
{
  "name": "John Updated"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "65abc123...",
      "name": "John Updated",
      "email": "john@example.com"
    }
  }
}
```

---

### 6. Create Task

**POST** `/tasks`

Create a new task.

**Request:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README and API docs",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "priority": "High",
  "status": "To Do",
  "assignedToId": "65abc456..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "65xyz789...",
      "title": "Complete project documentation",
      "description": "Write comprehensive README and API docs",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "priority": "High",
      "status": "To Do",
      "creatorId": {
        "_id": "65abc123...",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "assignedToId": {
        "_id": "65abc456...",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 7. Get All Tasks

**GET** `/tasks`

Get all tasks with optional filters.

**Query Parameters:**
- `status`: To Do | In Progress | Review | Completed
- `priority`: Low | Medium | High | Urgent
- `assignedToId`: User ID
- `creatorId`: User ID
- `overdue`: true | false
- `sortBy`: dueDate | createdAt | priority | status
- `sortOrder`: asc | desc

**Examples:**

Get all tasks:
```
GET /tasks
```

Get high priority tasks:
```
GET /tasks?priority=High
```

Get overdue tasks:
```
GET /tasks?overdue=true
```

Get tasks sorted by due date:
```
GET /tasks?sortBy=dueDate&sortOrder=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "65xyz789...",
        "title": "Complete project documentation",
        "status": "To Do",
        "priority": "High",
        // ... full task object
      }
    ],
    "count": 1
  }
}
```

---

### 8. Get Task by ID

**GET** `/tasks/:id`

Get a specific task.

```
GET /tasks/65xyz789...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "65xyz789...",
      "title": "Complete project documentation",
      // ... full task object with populated references
    }
  }
}
```

---

### 9. Update Task

**PUT** `/tasks/:id`

Update task details.

**Request:**
```json
{
  "status": "In Progress",
  "priority": "Urgent"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      // ... updated task object
    }
  }
}
```

---

### 10. Delete Task

**DELETE** `/tasks/:id`

Delete a task (creator only).

```
DELETE /tasks/65xyz789...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

### 11. Get Dashboard

**GET** `/tasks/dashboard`

Get user dashboard with assigned, created, and overdue tasks.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignedTasks": [
      // ... tasks assigned to current user
    ],
    "createdTasks": [
      // ... tasks created by current user
    ],
    "overdueTasks": [
      // ... overdue tasks
    ]
  }
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to update this task"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📝 Postman Collection

### Import Steps

1. Open Postman
2. Click "Import"
3. Create new collection "Task Manager API"
4. Add requests for each endpoint above

### Environment Variables

Create environment with:
- `baseUrl`: http://localhost:5000/api
- `token`: (will be set after login)

### Sample Workflow

1. **Register**
   - POST {{baseUrl}}/auth/register
   - Copy token from response

2. **Login**
   - POST {{baseUrl}}/auth/login
   - Copy token from response
   - Save to environment variable

3. **Get Profile**
   - GET {{baseUrl}}/auth/me
   - Header: Authorization: Bearer {{token}}

4. **Create Task**
   - POST {{baseUrl}}/tasks
   - Header: Authorization: Bearer {{token}}
   - Body: JSON task data

5. **Get Tasks**
   - GET {{baseUrl}}/tasks
   - Header: Authorization: Bearer {{token}}

---

## 🧪 Testing Scenarios

### Scenario 1: Complete User Journey

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'

# Save the token from response

# 2. Create Task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"Test Task",
    "description":"Testing API",
    "dueDate":"2024-12-31T23:59:59.000Z",
    "priority":"High",
    "status":"To Do"
  }'

# 3. Get All Tasks
curl http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Update Task
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"status":"In Progress"}'
```

### Scenario 2: Test Authorization

```bash
# Try to create task without token (should fail)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}'

# Expected: 401 Unauthorized
```

### Scenario 3: Test Validation

```bash
# Try to create task with invalid data
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"X"}'

# Expected: 400 with validation errors
```

---

## 🎯 Quick Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | ❌ | Health check |
| POST | `/auth/register` | ❌ | Register user |
| POST | `/auth/login` | ❌ | Login user |
| GET | `/auth/me` | ✅ | Get current user |
| PUT | `/auth/profile` | ✅ | Update profile |
| POST | `/tasks` | ✅ | Create task |
| GET | `/tasks` | ✅ | Get all tasks |
| GET | `/tasks/:id` | ✅ | Get task |
| PUT | `/tasks/:id` | ✅ | Update task |
| DELETE | `/tasks/:id` | ✅ | Delete task |
| GET | `/tasks/dashboard` | ✅ | Get dashboard |

---

**Happy Testing!** 🧪
