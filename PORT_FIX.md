# Port Configuration Fixed

## Issue
Port 5000 is used by macOS AirPlay Receiver (a system service), so we can't use it for our backend.

## Solution
Changed the backend port from **5000** to **5001**.

## Updated Configuration
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000
- **API Proxy**: Frontend proxies `/api` requests to `http://localhost:5001`

## Files Updated
1. `server/.env` - Changed `PORT=5001`
2. `client/vite.config.js` - Updated proxy target to `http://localhost:5001`

## Run the Application

Now you can run:

```bash
npm run dev
```

The application will work exactly the same, just using port 5001 for the backend instead of 5000.

