#!/bin/bash

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "⚠️  .env file not found. Creating default..."
    cat > server/.env << 'EOF'
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=habit-tracker-secret-key-change-in-production
PORT=5000
EOF
    echo "✅ Created server/.env - Please update DB_PASSWORD if needed"
fi

# Check if database is initialized
echo "🚀 Starting Habit Tracker..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Run both servers
npm run dev

