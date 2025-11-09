# ✅ Setup Complete! Ready to Run

## Everything is Configured

✅ Database created: `habit_tracker`  
✅ Database schema initialized  
✅ Environment file created: `server/.env`  
✅ All dependencies installed  
✅ Ports cleared

## 🚀 Run the Application

Simply run:

```bash
npm run dev
```

This will start:
- **Backend** on http://localhost:5000
- **Frontend** on http://localhost:3000

## 🌐 Open in Browser

Once you see both servers running, open:

**http://localhost:3000**

## 📝 First Steps

1. **Register** a new account
2. **Create** your first habit (you'll answer questions about motivation, timing, etc.)
3. **Log** your habit completion daily
4. **View** your growth plant and weekly reports

## ⚠️ If You Get Port Errors

If you see "port already in use" errors, run:

```bash
lsof -ti:5000 -ti:3000 | xargs kill -9
```

Then run `npm run dev` again.

## 🔧 Database Info

- **User**: manasvisharma (your macOS username)
- **Database**: habit_tracker
- **Password**: (none - local connection)

If you need to reset the database:

```bash
dropdb habit_tracker
createdb habit_tracker
cd server
node -e "require('./database/init').initDatabase().then(() => process.exit())"
```

---

**You're all set! Run `npm run dev` to start! 🎉**

