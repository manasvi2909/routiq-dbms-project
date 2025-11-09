# Habit Tracker - Full Stack Application

A comprehensive habit tracking application with mood tracking, visual growth plant, weekly reports, and intelligent reminders.

## Features

- ✅ **User Authentication** - Secure login and registration
- ✅ **Habit Logging** - Multi-step form with completion percentage (0-3 scale)
- ✅ **Mood & Stress Tracker** - Track mood and stress levels (1-5 scale) while completing habits
- ✅ **Visual Growth Plant** - Plant that grows based on habit completion consistency
- ✅ **Habit Creation with Questions** - Series of questions to help attach value to habits:
  - When specifically? (Planning)
  - What's motivating me? (Motivation)
  - What's hindering me? (Challenges)
  - Whom do I tell? (Accountability)
  - Who inspires me? (Inspiration)
  - My milestones are (Goals)
  - I'm gonna treat myself with (Rewards)
- ✅ **Inconsistent Habits Analysis** - Detects inconsistent habits and asks follow-up questions
- ✅ **Reminders & Notifications** - Daily reminders for habit logging
- ✅ **Weekly Reports** - Comprehensive reports with charts:
  - Habit completion rates (Bar chart)
  - Mood distribution (Pie chart)
  - Stress level distribution (Bar chart)
  - Week-over-week comparison (Line chart)
- ✅ **Settings** - Configure reminder times and preferences

## Tech Stack

### Backend
- **Node.js** with Express.js
- **PostgreSQL** (SQL database)
- **JWT** for authentication
- **node-cron** for scheduled reminders
- **bcryptjs** for password hashing

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Recharts** for data visualization
- **Axios** for API calls
- **Lucide React** for icons

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
```bash
createdb habit_tracker
```

2. Update the database credentials in `server/.env`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habit_tracker
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

3. Copy the example env file:
```bash
cd server
cp .env.example .env
# Edit .env with your database credentials
```

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Initialize the database (from server directory):
```bash
cd server
node -e "require('./database/init').initDatabase().then(() => process.exit())"
```

### Running the Application

#### Option 1: Run both server and client together
From the root directory:
```bash
npm run dev
```

#### Option 2: Run separately

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
routiq-dbms-project/
├── server/
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   └── init.js             # Database initialization
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── habits.js           # Habit CRUD routes
│   │   ├── logs.js             # Habit logging routes
│   │   ├── mood.js             # Mood tracking routes
│   │   ├── reports.js          # Report generation routes
│   │   └── notifications.js    # Notification routes
│   ├── services/
│   │   ├── consistencyService.js  # Habit consistency analysis
│   │   ├── reportService.js       # Weekly report generation
│   │   └── reminderService.js     # Reminder scheduling
│   ├── index.js                # Server entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── contexts/          # React contexts
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── App.jsx            # Main app component
│   └── package.json
└── package.json               # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/reminder-settings` - Update reminder settings

### Habits
- `GET /api/habits` - Get all habits
- `GET /api/habits/:id` - Get single habit
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/:id/consistency` - Get consistency analysis

### Logs
- `POST /api/logs` - Log habit completion
- `GET /api/logs` - Get all logs
- `GET /api/logs/habit/:habit_id` - Get logs for specific habit

### Mood
- `POST /api/mood` - Log mood
- `GET /api/mood` - Get mood logs

### Reports
- `GET /api/reports/weekly` - Get current week report
- `GET /api/reports/weekly/compare?weeks=4` - Get weekly comparison

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `habits` - Habit definitions with question answers
- `habit_logs` - Daily habit completion logs
- `mood_logs` - Mood and stress tracking
- `weekly_reports` - Generated weekly reports
- `notifications` - User notifications

## Features in Detail

### Habit Logging Questions
When creating a habit, users answer a series of questions:
1. **When Specifically?** - Planning when to do the habit
2. **What's Motivating Me?** - Understanding the "why"
3. **What's Hindering Me?** - Identifying obstacles
4. **Whom Do I Tell?** - Accountability partners
5. **Who Inspires Me?** - Role models
6. **My Milestones Are** - Goal setting
7. **I'm Gonna Treat Myself With** - Rewards

### Inconsistent Habits Analysis
- Automatically detects habits with <50% completion rate
- Prompts user to continue or remove
- If continuing, asks for reason (used as daily reminder)
- Sends motivational notifications based on user's reason

### Visual Growth Plant
- Plant grows based on overall habit completion rate
- Stages: Seed → Sprout → Growing → Thriving → Flourishing → Blooming
- Visual feedback encourages consistency

### Weekly Reports
- Comprehensive analytics with multiple chart types
- Side-by-side week comparison
- Mood and stress analysis per habit
- Consistency tracking

## Development

### Adding New Features
1. Update database schema if needed (`server/database/schema.sql`)
2. Create/update backend routes (`server/routes/`)
3. Create/update frontend components (`client/src/`)
4. Test thoroughly

### Database Migrations
To update the database schema, modify `schema.sql` and re-run the initialization script.

## License

This project is created for educational purposes.

## Support

For issues or questions, please check the code comments or create an issue in the repository.

