# Quick Setup Guide

## Step 1: Install PostgreSQL (if not installed)

### macOS (using Homebrew):
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Or download from:
https://www.postgresql.org/download/macosx/

## Step 2: Create Database

After PostgreSQL is installed, run:
```bash
createdb habit_tracker
```

If you get a permission error, you might need to create a user first:
```bash
createuser -s postgres
createdb habit_tracker
```

## Step 3: Configure Environment

Create `server/.env` file with your database credentials:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=your_postgres_password
DB_PORT=5432
JWT_SECRET=habit-tracker-secret-key-change-in-production
PORT=5000
```

**Note:** If you haven't set a password for postgres user, the default might be empty or you may need to set one.

## Step 4: Initialize Database

```bash
cd server
node -e "require('./database/init').initDatabase().then(() => { console.log('Database initialized!'); process.exit(); })"
```

## Step 5: Run the Application

From the root directory:
```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 3000).

## Access the Website

Open your browser and go to: **http://localhost:3000**

## Troubleshooting

### PostgreSQL Connection Issues:
- Make sure PostgreSQL is running: `brew services list` (macOS) or check your system services
- Check if the database exists: `psql -l` should show `habit_tracker`
- Verify your password in `server/.env` matches your PostgreSQL password

### Port Already in Use:
- Change PORT in `server/.env` if 5000 is taken
- Change port in `client/vite.config.js` if 3000 is taken

