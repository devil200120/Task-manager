#!/bin/bash

echo "================================================"
echo " Task Manager - Setup Script"
echo "================================================"
echo ""

# Check Node.js installation
echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "Node.js: $(node --version)"
echo ""

# Install backend dependencies
echo "[2/5] Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cp .env.example .env
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    exit 1
fi
cd ..
echo "Backend dependencies: OK"
echo ""

# Install frontend dependencies
echo "[3/5] Installing frontend dependencies..."
cd frontend
if [ ! -f ".env" ]; then
    echo "Creating frontend .env file..."
    cp .env.example .env
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies!"
    exit 1
fi
cd ..
echo "Frontend dependencies: OK"
echo ""

# Check MongoDB
echo "[4/5] Checking MongoDB..."
echo "NOTE: Make sure MongoDB is running on localhost:27017"
echo "Or update MONGODB_URI in backend/.env"
echo ""

# Complete
echo "[5/5] Setup Complete!"
echo ""
echo "================================================"
echo " Next Steps:"
echo "================================================"
echo ""
echo "1. Update backend/.env with your MongoDB URI"
echo "2. Start backend:  cd backend && npm run dev"
echo "3. Start frontend: cd frontend && npm run dev"
echo ""
echo "OR use Docker:"
echo "  docker-compose up -d"
echo ""
echo "================================================"
