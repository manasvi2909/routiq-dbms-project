const express = require('express');
const { pool } = require('../database/init');
const authenticate = require('../middleware/auth');
const { analyzeHabitConsistency } = require('../services/consistencyService');

const router = express.Router();

// Get all habits for user
router.get('/', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single habit
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM habits WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create habit with logging questions
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      name,
      description,
      when_specifically,
      what_motivating,
      what_hindering,
      whom_tell,
      who_inspires,
      milestones,
      treat_myself
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Habit name is required' });
    }

    const result = await pool.query(
      `INSERT INTO habits (
        user_id, name, description, when_specifically, what_motivating,
        what_hindering, whom_tell, who_inspires, milestones, treat_myself
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        req.user.id, name, description || null,
        when_specifically || null, what_motivating || null,
        what_hindering || null, whom_tell || null,
        who_inspires || null, milestones || null, treat_myself || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update habit
router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      name,
      description,
      when_specifically,
      what_motivating,
      what_hindering,
      whom_tell,
      who_inspires,
      milestones,
      treat_myself,
      is_active,
      continue_reason,
      failure_analysis
    } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (when_specifically !== undefined) {
      updates.push(`when_specifically = $${paramCount++}`);
      values.push(when_specifically);
    }
    if (what_motivating !== undefined) {
      updates.push(`what_motivating = $${paramCount++}`);
      values.push(what_motivating);
    }
    if (what_hindering !== undefined) {
      updates.push(`what_hindering = $${paramCount++}`);
      values.push(what_hindering);
    }
    if (whom_tell !== undefined) {
      updates.push(`whom_tell = $${paramCount++}`);
      values.push(whom_tell);
    }
    if (who_inspires !== undefined) {
      updates.push(`who_inspires = $${paramCount++}`);
      values.push(who_inspires);
    }
    if (milestones !== undefined) {
      updates.push(`milestones = $${paramCount++}`);
      values.push(milestones);
    }
    if (treat_myself !== undefined) {
      updates.push(`treat_myself = $${paramCount++}`);
      values.push(treat_myself);
    }
    if (is_active !== undefined) {
      updates.push(`is_active = $${paramCount++}`);
      values.push(is_active);
    }
    if (continue_reason !== undefined) {
      updates.push(`continue_reason = $${paramCount++}`);
      values.push(continue_reason);
    }
    if (failure_analysis !== undefined) {
      updates.push(`failure_analysis = $${paramCount++}`);
      values.push(failure_analysis);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(req.params.id, req.user.id);

    const result = await pool.query(
      `UPDATE habits SET ${updates.join(', ')} 
       WHERE id = $${paramCount++} AND user_id = $${paramCount++} 
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete habit
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM habits WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analyze habit consistency
router.get('/:id/consistency', authenticate, async (req, res) => {
  try {
    const habitId = req.params.id;
    
    // Verify habit belongs to user
    const habitCheck = await pool.query(
      'SELECT id FROM habits WHERE id = $1 AND user_id = $2',
      [habitId, req.user.id]
    );

    if (habitCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const analysis = await analyzeHabitConsistency(habitId, req.user.id);
    res.json(analysis);
  } catch (error) {
    console.error('Consistency analysis error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

