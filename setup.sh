#!/bin/bash

echo "🌱 Habit Tracker Setup Script"
echo "================================"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed."
    echo ""
    echo "Please install PostgreSQL first:"
    echo "  macOS: brew install postgresql@14"
    echo "  Then run: brew services start postgresql@14"
    echo ""
    echo "Or download from: https://www.postgresql.org/download/"
    exit 1
fi

echo "✅ PostgreSQL found"

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw habit_tracker; then
    echo "✅ Database 'habit_tracker' already exists"
else
    echo "📦 Creating database 'habit_tracker'..."
    createdb habit_tracker 2>/dev/null || {
        echo "⚠️  Could not create database. Trying with postgres user..."
        createuser -s postgres 2>/dev/null
        createdb habit_tracker || {
            echo "❌ Failed to create database. Please create it manually:"
            echo "   createdb habit_tracker"
            exit 1
        }
    }
    echo "✅ Database created"
fi

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file..."
    cat > server/.env << EOF
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=habit-tracker-secret-key-change-in-production
PORT=5000
EOF
    echo "✅ .env file created"
    echo "⚠️  Please update server/.env with your actual PostgreSQL password if needed"
else
    echo "✅ .env file already exists"
fi

# Install dependencies if node_modules don't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Initialize database
echo "🗄️  Initializing database schema..."
cd server
node -e "require('./database/init').initDatabase().then(() => { console.log('✅ Database initialized successfully!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); })"
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To run the application:"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""

