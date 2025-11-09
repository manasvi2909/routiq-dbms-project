const cron = require('node-cron');
const { pool } = require('../database/init');

async function sendDailyReminders() {
  try {
    // Get all users with reminders enabled
    const usersResult = await pool.query(
      'SELECT id, username, reminder_time, reminder_enabled FROM users WHERE reminder_enabled = true'
    );

    const today = new Date().toISOString().split('T')[0];

    for (const user of usersResult.rows) {
      // Get active habits for user
      const habitsResult = await pool.query(
        'SELECT id, name FROM habits WHERE user_id = $1 AND is_active = true',
        [user.id]
      );

      if (habitsResult.rows.length === 0) continue;

      // Check if user has already logged today
      const todayLogsResult = await pool.query(
        'SELECT COUNT(*) as count FROM habit_logs WHERE user_id = $1 AND log_date = $2',
        [user.id, today]
      );

      const hasLoggedToday = parseInt(todayLogsResult.rows[0].count) > 0;

      if (!hasLoggedToday) {
        // Create reminder notification
        const habitNames = habitsResult.rows.map(h => h.name).join(', ');
        const message = `Don't forget to log your habits today! ${habitNames}`;

        await pool.query(
          'INSERT INTO notifications (user_id, message, notification_type) VALUES ($1, $2, $3)',
          [user.id, message, 'reminder']
        );
      }

      // Check for inconsistent habits
      for (const habit of habitsResult.rows) {
        const { analyzeHabitConsistency } = require('./consistencyService');
        const analysis = await analyzeHabitConsistency(habit.id, user.id);

        if (analysis.isInconsistent) {
          const habitDataResult = await pool.query(
            'SELECT continue_reason, is_inconsistent FROM habits WHERE id = $1',
            [habit.id]
          );

          const habitData = habitDataResult.rows[0];

          if (habitData.is_inconsistent && habitData.continue_reason) {
            // Send reminder with motivation
            const message = `Remember: ${habit.name}. ${habitData.continue_reason}`;
            await pool.query(
              'INSERT INTO notifications (user_id, habit_id, message, notification_type) VALUES ($1, $2, $3, $4)',
              [user.id, habit.id, message, 'motivation']
            );
          }
        }
      }
    }

    console.log('Daily reminders sent');
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}

// Schedule reminders to run every hour and check if it's time to send
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:00:00`;

    const usersResult = await pool.query(
      'SELECT id FROM users WHERE reminder_enabled = true AND reminder_time = $1',
      [currentTime]
    );

    if (usersResult.rows.length > 0) {
      await sendDailyReminders();
    }
  } catch (error) {
    console.error('Error in reminder cron job:', error);
  }
});

// Also send reminders at 9 AM by default
cron.schedule('0 9 * * *', sendDailyReminders);

function start() {
  console.log('Reminder service started');
}

module.exports = { start, sendDailyReminders };

