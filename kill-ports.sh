#!/bin/bash

echo "🔍 Checking for processes on ports 5000 and 3000..."

# Kill processes on port 5000
PIDS_5000=$(lsof -ti:5000 2>/dev/null)
if [ ! -z "$PIDS_5000" ]; then
    echo "Killing processes on port 5000: $PIDS_5000"
    kill -9 $PIDS_5000 2>/dev/null
    echo "✅ Port 5000 cleared"
else
    echo "✅ Port 5000 is free"
fi

# Kill processes on port 3000
PIDS_3000=$(lsof -ti:3000 2>/dev/null)
if [ ! -z "$PIDS_3000" ]; then
    echo "Killing processes on port 3000: $PIDS_3000"
    kill -9 $PIDS_3000 2>/dev/null
    echo "✅ Port 3000 cleared"
else
    echo "✅ Port 3000 is free"
fi

# Kill any leftover nodemon processes
NODEMON_PIDS=$(ps aux | grep nodemon | grep -v grep | awk '{print $2}')
if [ ! -z "$NODEMON_PIDS" ]; then
    echo "Killing nodemon processes: $NODEMON_PIDS"
    kill -9 $NODEMON_PIDS 2>/dev/null
    echo "✅ Nodemon processes cleared"
fi

echo ""
echo "✅ All ports cleared! You can now run 'npm run dev'"

