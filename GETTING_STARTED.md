# 🚀 Getting Started with Task Manager

This guide will help you set up and run the Task Manager application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)
- **npm** (comes with Node.js)

Optional:
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop) (for containerized setup)

## 🎯 Choose Your Setup Method

### Option 1: Quick Setup (Recommended for Development)

#### Windows:
```cmd
# Run the automated setup script
setup.bat
```

#### Linux/Mac:
```bash
# Make the script executable
chmod +x setup.sh

# Run the automated setup script
./setup.sh
```

This script will:
- Check Node.js installation
- Install all dependencies
- Create environment files
- Guide you through next steps

### Option 2: Manual Setup

#### Step 1: Clone or Navigate to Project
```bash
cd "c:\Users\KIIT0001\Desktop\inteshala Task"
```

#### Step 2: Setup Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Linux/Mac

# Edit .env file with your MongoDB URI
```

#### Step 3: Setup Frontend
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Linux/Mac
```

### Option 3: Docker Setup (Easiest)

```bash
# From root directory
docker-compose up -d

# View logs
docker-compose logs -f

# Access application at http://localhost
```

See [DOCKER.md](DOCKER.md) for detailed Docker instructions.

## ⚙️ Configuration

### Backend Configuration (backend/.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database (Choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/task-manager

# OR MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager

# JWT Secret (generate with: openssl rand -hex 32)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (frontend/.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test

# With coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Results
The test suite includes 6 unit tests covering:
- Task creation with validation
- Authorization checks
- Due date validation
- Dashboard data aggregation

## 🔍 Verify Installation

### Check Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Or visit in browser
http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Check Frontend
Visit http://localhost:5173 - you should see the login page.

## 📱 First-Time Usage

### 1. Register a New Account
- Go to http://localhost:5173
- Click "Sign up"
- Fill in your details:
  - Name (min 2 characters)
  - Email (valid email format)
  - Password (min 6 characters)
- Click "Sign Up"

### 2. Login
- Enter your email and password
- Click "Sign In"
- You'll be redirected to the dashboard

### 3. Create Your First Task
- Click "+ Create New Task"
- Fill in:
  - **Title**: Brief task description (max 100 chars)
  - **Description**: Detailed information
  - **Due Date**: When the task should be completed
  - **Priority**: Low, Medium, High, or Urgent
  - **Status**: To Do (default)
  - **Assign To** (optional): Assign to yourself or another user
- Click "Create Task"

### 4. Test Real-Time Features
- Open the app in two browser windows
- Login with different accounts (or same account)
- Create/update a task in one window
- Watch it update in real-time in the other window

## 🛠️ Common Issues and Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/.env`
- For Atlas, verify IP whitelist and credentials

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```
Or change PORT in `backend/.env`

### Issue: "Port 5173 already in use"
**Solution:**
Change port in `frontend/vite.config.ts`:
```typescript
server: {
  port: 3000,  // Change to any available port
}
```

### Issue: "Module not found"
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CORS errors"
**Solution:**
- Verify `CLIENT_URL` in backend `.env`
- Ensure it matches your frontend URL
- Restart backend server

### Issue: "Socket.io not connecting"
**Solution:**
- Check `VITE_SOCKET_URL` in frontend `.env`
- Verify backend is running
- Check browser console for errors
- Try refreshing the page

## 📚 Additional Resources

- **Main Documentation**: [README.md](README.md)
- **Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Docker Instructions**: [DOCKER.md](DOCKER.md)
- **Project Summary**: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🎯 Development Workflow

### Making Changes

1. **Backend Changes**:
   - Edit files in `backend/src/`
   - Server auto-restarts (ts-node-dev)
   - Check terminal for errors

2. **Frontend Changes**:
   - Edit files in `frontend/src/`
   - Browser auto-refreshes (Vite HMR)
   - Check browser console for errors

### Adding New Features

1. **Backend API Endpoint**:
   - Create/update model in `models/`
   - Add DTO validation in `dtos/`
   - Implement repository in `repositories/`
   - Add business logic in `services/`
   - Create controller in `controllers/`
   - Add route in `routes/`
   - Write tests in `*.test.ts`

2. **Frontend Feature**:
   - Add types in `types/`
   - Create API method in `lib/api.ts`
   - Build component in `components/`
   - Add page in `pages/`
   - Update routing in `App.tsx`

## 🔐 Security Notes

For Development:
- Use provided `.env` examples
- JWT_SECRET can be simple

For Production:
- Generate secure JWT_SECRET: `openssl rand -hex 32`
- Use environment variables
- Enable HTTPS
- Use MongoDB Atlas with authentication
- Review CORS settings
- Enable rate limiting
- Add logging and monitoring

## 📞 Need Help?

1. Check the [README.md](README.md) for comprehensive docs
2. Review error messages in:
   - Backend terminal
   - Frontend terminal  
   - Browser console
3. Check MongoDB connection
4. Verify environment variables
5. Try the Docker setup for consistency

## ✅ Quick Checklist

Before starting development:
- [ ] Node.js installed and working
- [ ] MongoDB running (local or Atlas)
- [ ] Dependencies installed (npm install)
- [ ] Environment files created and configured
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Can register and login
- [ ] Can create tasks
- [ ] Real-time updates working

## 🚀 Ready to Deploy?

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment instructions.

---

**You're all set!** Start building amazing task management features! 🎉
