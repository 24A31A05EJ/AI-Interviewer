#!/bin/bash

echo ""
echo "============================================"
echo "AI Interview Prep - Quick Start"
echo "============================================"
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not found. Please install from https://nodejs.org/"
    exit 1
fi

echo "Node.js found:"
node -v

# Install server
echo ""
echo "[1/4] Installing backend..."
cd server
if [ -d "node_modules" ]; then
    echo "Backend dependencies already installed"
else
    npm install
fi

# Create .env if not exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Edit server/.env with your MongoDB connection string"
    echo "Example: MONGO_URI=mongodb://localhost:27017/ai_interview_platform"
    read -p "Press Enter to continue..."
fi

# Install client
echo ""
echo "[2/4] Installing frontend..."
cd ../client
if [ -d "node_modules" ]; then
    echo "Frontend dependencies already installed"
else
    npm install
fi

echo ""
echo "[3/4] Setup complete!"
echo ""
echo "To run the project:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
echo "Demo credentials:"
echo "  Email: demo@example.com"
echo "  Password: password"
echo ""
