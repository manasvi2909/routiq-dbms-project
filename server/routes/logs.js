const express = require('express');
const { pool } = require('../database/init');
const authenticate = require('../middleware/auth');
const { analyzeHabitConsistency } = require('../services/consistencyService');

const router = express.Router();

// Log habit completion
router.post('/', authenticate, async (req, res) => {
  try {
    const { habit_id, log_date, completion_percentage, mood, stress_level, notes } = req.body;

    if (!habit_id || !log_date) {
      return res.status(400).json({ error: 'Habit ID and date are required' });
    }

    // Verify habit belongs to user
    const habitCheck = await pool.query(
      'SELECT id FROM habits WHERE id = $1 AND user_id = $2',
      [habit_id, req.user.id]
    );

    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Insert or update log
    const result = await pool.query(
      `INSERT INTO habit_logs (habit_id, user_id, log_date, completion_percentage, mood, stress_level, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (habit_id, log_date)
       DO UPDATE SET
         completion_percentage = EXCLUDED.completion_percentage,
         mood = EXCLUDED.mood,
         stress_level = EXCLUDED.stress_level,
         notes = EXCLUDED.notes
       RETURNING *`,
      [
        habit_id, req.user.id, log_date,
        completion_percentage || 0,
        mood || null,
        stress_level || null,
        notes || null
      ]
    );

    // Update habit statistics
    await updateHabitStats(habit_id, log_date);

    // Check consistency after logging
    const analysis = await analyzeHabitConsistency(habit_id, req.user.id);
    if (analysis.isInconsistent) {
      await pool.query(
        'UPDATE habits SET is_inconsistent = true WHERE id = $1',
        [habit_id]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Log habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get logs for a habit
router.get('/habit/:habit_id', authenticate, async (req, res) => {
  try {
    const { habit_id } = req.params;
    const { start_date, end_date } = req.query;

    let query = 'SELECT * FROM habit_logs WHERE habit_id = $1 AND user_id = $2';
    const params = [habit_id, req.user.id];

    if (start_date && end_date) {
      query += ' AND log_date BETWEEN $3 AND $4';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY log_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all logs for user
router.get('/', authenticate, async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    let query = 'SELECT * FROM habit_logs WHERE user_id = $1';
    const params = [req.user.id];

    if (start_date && end_date) {
      query += ' AND log_date BETWEEN $2 AND $3';
      params.push(start_date, end_date);
    }

    query += ' ORDER BY log_date DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get all logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper function to update habit statistics
async function updateHabitStats(habitId, logDate) {
  try {
    // Get completion count for last 30 days
    const thirtyDaysAgo = new Date(logDate);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completionResult = await pool.query(
      `SELECT COUNT(*) as count, MAX(log_date) as last_completed
       FROM habit_logs
       WHERE habit_id = $1 AND log_date >= $2 AND completion_percentage > 0`,
      [habitId, thirtyDaysAgo.toISOString().split('T')[0]]
    );

    const count = parseInt(completionResult.rows[0].count);
    const lastCompleted = completionResult.rows[0].last_completed;

    // Calculate consecutive days
    const consecutiveResult = await pool.query(
      `WITH RECURSIVE date_series AS (
        SELECT $1::date as check_date
        UNION ALL
        SELECT check_date - INTERVAL '1 day'
        FROM date_series
        WHERE check_date > $2::date
      )
      SELECT COUNT(*) as consecutive
      FROM date_series ds
      WHERE EXISTS (
        SELECT 1 FROM habit_logs hl
        WHERE hl.habit_id = $3
        AND hl.log_date = ds.check_date
        AND hl.completion_percentage > 0
      )
      AND NOT EXISTS (
        SELECT 1 FROM date_series ds2
        WHERE ds2.check_date = ds.check_date - INTERVAL '1 day'
        AND NOT EXISTS (
          SELECT 1 FROM habit_logs hl2
          WHERE hl2.habit_id = $3
          AND hl2.log_date = ds2.check_date
          AND hl2.completion_percentage > 0
        )
      )`,
      [logDate, thirtyDaysAgo.toISOString().split('T')[0], habitId]
    );

    const consecutiveDays = parseInt(consecutiveResult.rows[0]?.consecutive || 0);

    // Update habit
    await pool.query(
      `UPDATE habits 
       SET total_completions = $1, 
           consecutive_days = $2,
           last_completed_at = $3
       WHERE id = $4`,
      [count, consecutiveDays, lastCompleted, habitId]
    );
  } catch (error) {
    console.error('Update habit stats error:', error);
  }
}

module.exports = router;

