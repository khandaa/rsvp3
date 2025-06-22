#!/bin/bash

# RSVP Event App Deployment Script
# This script builds and deploys both frontend and backend components

echo "=== RSVP Event App Deployment ==="
echo "Starting deployment process..."

# Check if virtual environment exists, if not create it
if [ ! -d "/Users/alokk/EmployDEX/venv" ]; then
    echo "Creating virtual environment at /Users/alokk/EmployDEX/venv"
    python3 -m venv /Users/alokk/EmployDEX/venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source /Users/alokk/EmployDEX/venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Backend deployment
echo "=== Backend Deployment ==="
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Set production environment
echo "Setting up production environment..."
export NODE_ENV=production

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating backend .env file..."
    cat > .env << EOL
PORT=5010
JWT_SECRET=your_production_jwt_secret_key_here
NODE_ENV=production
FRONTEND_URL=https://your-production-frontend-url
EOL
    echo "Created backend .env file. Please update with production values."
fi

# Build backend (if any build steps)
echo "Backend setup complete"

# Frontend deployment
echo "=== Frontend Deployment ==="
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
if [ -d "/Users/alokk/EmployDEX/node_modules" ]; then
    echo "Using existing node_modules from /Users/alokk/EmployDEX/node_modules"
    ln -sf /Users/alokk/EmployDEX/node_modules ./node_modules
else
    echo "Creating node_modules directory at /Users/alokk/EmployDEX/node_modules"
    mkdir -p /Users/alokk/EmployDEX/node_modules
    ln -sf /Users/alokk/EmployDEX/node_modules ./node_modules
    npm install
fi

# Create production .env file if it doesn't exist
if [ ! -f ".env.production" ]; then
    echo "Creating frontend production .env file..."
    cat > .env.production << EOL
REACT_APP_API_URL=https://your-production-api-url
EOL
    echo "Created frontend production .env file. Please update with production values."
fi

# Build frontend for production
echo "Building frontend for production..."
npm run build

# Return to project root
cd ..

echo "=== Deployment Complete ==="
echo "Frontend build available in: frontend/build"
echo "Backend ready for production"
echo ""
echo "To start the application in production:"
echo "1. Backend: cd backend && NODE_ENV=production node server.js"
echo "2. Frontend: Serve the static files from frontend/build using a web server"
echo ""
echo "Default admin credentials:"
echo "Username: admin"
echo "Password: admin"
