# Task Manager - Root Directory

This is the root directory for the full-stack Task Manager application.

## Quick Start

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup Environment Variables

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
# Edit .env with your API URLs
```

### 3. Start Development Servers

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health: http://localhost:5000/api/health

## Project Structure

```
task-manager/
├── backend/           # Express + TypeScript + MongoDB backend
├── frontend/          # React + TypeScript + Vite frontend
└── README.md         # Complete documentation
```

## Documentation

See the main [README.md](./README.md) for comprehensive documentation including:
- Full setup instructions
- API documentation
- Architecture decisions
- Deployment guide
- Testing information

## Testing

**Backend Tests:**
```bash
cd backend
npm test
```

## Build for Production

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Requirements

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Support

For issues or questions, please refer to the complete documentation in README.md
