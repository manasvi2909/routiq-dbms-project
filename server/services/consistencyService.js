const { pool } = require('../database/init');

async function analyzeHabitConsistency(habitId, userId) {
  try {
    // Get habit details
    const habitResult = await pool.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, userId]
    );

    if (habitResult.rows.length === 0) {
      throw new Error('Habit not found');
    }

    const habit = habitResult.rows[0];

    // Get logs from last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const logsResult = await pool.query(
      `SELECT log_date, completion_percentage 
       FROM habit_logs 
       WHERE habit_id = $1 AND log_date >= $2
       ORDER BY log_date DESC`,
      [habitId, fourteenDaysAgo.toISOString().split('T')[0]]
    );

    const logs = logsResult.rows;
    const totalDays = 14;
    const completedDays = logs.filter(log => log.completion_percentage > 0).length;
    const completionRate = (completedDays / totalDays) * 100;

    // Check for gaps (missing days)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const logDates = new Set(logs.map(log => log.log_date));
    
    let missingDays = 0;
    for (let i = 0; i < totalDays; i++) {
      const checkDate = new Date(fourteenDaysAgo);
      checkDate.setDate(checkDate.getDate() + i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (!logDates.has(dateStr)) {
        missingDays++;
      }
    }

    // Consider inconsistent if:
    // - Completion rate < 50%
    // - More than 3 consecutive missing days
    // - Less than 5 completions in 14 days
    const isInconsistent = completionRate < 50 || missingDays > 3 || completedDays < 5;

    return {
      habitId,
      completionRate: Math.round(completionRate),
      completedDays,
      totalDays,
      missingDays,
      isInconsistent,
      logs: logs.slice(0, 7) // Last 7 days
    };
  } catch (error) {
    console.error('Consistency analysis error:', error);
    throw error;
  }
}

module.exports = { analyzeHabitConsistency };

