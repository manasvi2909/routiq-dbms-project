# 🚀 Quick Start Guide

## Prerequisites Check

1. **Node.js** ✅ (v24.9.0 detected)
2. **PostgreSQL** - Need to install (see below)

## Installation Steps

### 1. Install PostgreSQL (macOS)

```bash
# Using Homebrew (recommended)
brew install postgresql@14
brew services start postgresql@14
```

**OR** download the installer from: https://www.postgresql.org/download/macosx/

### 2. Run Setup Script

```bash
cd /Users/manasvisharma/Desktop/routiq-dbms-project
./setup.sh
```

This script will:
- Check PostgreSQL installation
- Create the database
- Create .env file
- Install all dependencies
- Initialize database schema

### 3. Manual Setup (if script doesn't work)

#### Create Database:
```bash
createdb habit_tracker
```

#### Create .env file:
```bash
cd server
cat > .env << 'EOF'
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=habit-tracker-secret-key-change-in-production
PORT=5000
EOF
```

**Important:** Update `DB_PASSWORD` in `server/.env` if your PostgreSQL password is different.

#### Initialize Database:
```bash
cd server
node -e "require('./database/init').initDatabase().then(() => { console.log('Done!'); process.exit(); })"
```

### 4. Run the Application

```bash
# From the root directory
npm run dev
```

This starts:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

### 5. Open in Browser

Go to: **http://localhost:3000**

## First Steps

1. **Register** a new account
2. **Create** your first habit (you'll answer questions about motivation, timing, etc.)
3. **Log** your habit completion daily
4. **View** your growth plant and weekly reports

## Troubleshooting

### "psql: command not found"
- Install PostgreSQL (see step 1)

### "password authentication failed"
- Update `DB_PASSWORD` in `server/.env` with your PostgreSQL password
- Or reset PostgreSQL password: `psql postgres -c "ALTER USER postgres PASSWORD 'postgres';"`

### "database does not exist"
- Run: `createdb habit_tracker`

### Port 3000 or 5000 already in use
- Kill the process using the port or change ports in config files

### Database connection errors
- Make sure PostgreSQL is running: `brew services list` (macOS)
- Check PostgreSQL is listening: `lsof -i :5432`

## Need Help?

Check the full README.md for detailed documentation.

