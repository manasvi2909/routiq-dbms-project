import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import SubTasks from '../components/SubTasks';
import { Plus, Trash2, AlertCircle, Flame, CheckCircle2 } from 'lucide-react';
import './Habits.css';

function Habits() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [inconsistentHabits, setInconsistentHabits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await api.get('/habits');
      const allHabits = response.data;
      setHabits(allHabits);

      // Check for inconsistent habits
      const inconsistent = [];
      for (const habit of allHabits) {
        try {
          const analysis = await api.get(`/habits/${habit.id}/consistency`);
          if (analysis.data.isInconsistent) {
            inconsistent.push({ ...habit, analysis: analysis.data });
          }
        } catch (error) {
          console.error('Error checking consistency:', error);
        }
      }
      setInconsistentHabits(inconsistent);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      await api.delete(`/habits/${id}`);
      fetchHabits();
    } catch (error) {
      console.error('Error deleting habit:', error);
      alert('Error deleting habit');
    }
  };

  const handleInconsistentHabit = async (habit) => {
    const continueHabit = window.confirm(
      `Your habit "${habit.name}" is not being completed consistently. Do you want to continue with this habit?`
    );

    if (!continueHabit) {
      // Ask if they want to remove it
      if (window.confirm('Would you like to remove this habit?')) {
        await handleDelete(habit.id);
      }
    } else {
      // Ask why they want to continue
      const reason = prompt('Why do you want to continue with this habit? This will be used as a daily reminder.');
      if (reason) {
        try {
          await api.put(`/habits/${habit.id}`, {
            continue_reason: reason,
            is_inconsistent: true
          });
          alert('Your reason has been saved and will be used as a daily reminder!');
          fetchHabits();
        } catch (error) {
          console.error('Error updating habit:', error);
        }
      }
    }
  };

  if (loading) {
    return <div className="habits-loading">Loading...</div>;
  }

  return (
    <div className="habits-page">
      <div className="habits-header">
        <div>
          <h1>My Habits</h1>
          <p className="habits-subtitle">Manage your RoutiQ habits and track your progress</p>
        </div>
        <button onClick={() => navigate('/habits/new')} className="add-habit-btn">
          <Plus size={20} />
          Add Habit
        </button>
      </div>

      {inconsistentHabits.length > 0 && (
        <div className="inconsistent-alert">
          <AlertCircle size={20} />
          <div>
            <h3>Habits Needing Attention</h3>
            <p>Some of your habits are not being completed consistently.</p>
          </div>
        </div>
      )}

      {inconsistentHabits.map(habit => (
        <div key={habit.id} className="inconsistent-habit-card">
          <div className="inconsistent-header">
            <h3>{habit.name}</h3>
            <span className="inconsistent-badge">Inconsistent</span>
          </div>
          <p>Completion rate: {habit.analysis?.completionRate || 0}%</p>
          <button
            onClick={() => handleInconsistentHabit(habit)}
            className="review-btn"
          >
            Review Habit
          </button>
        </div>
      ))}

      <div className="habits-grid">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Start by adding your first habit!</p>
            <button onClick={() => navigate('/habits/new')} className="primary-btn">
              <Plus size={20} />
              Add Your First Habit
            </button>
          </div>
        ) : (
          habits.map(habit => (
            <div key={habit.id} className={`habit-card ${!habit.is_active ? 'inactive' : ''}`}>
              <div className="habit-header">
                <h3>{habit.name}</h3>
                {habit.is_inconsistent && (
                  <AlertCircle className="warning-badge" size={20} />
                )}
              </div>
              {habit.description && <p className="habit-description">{habit.description}</p>}
              <div className="habit-stats">
                <span>
                  <Flame size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {habit.consecutive_days || 0} day streak
                </span>
                <span>
                  <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {habit.total_completions || 0} completions
                </span>
              </div>
              <div className="habit-actions">
                <Link to={`/habits/${habit.id}/log`} className="action-btn log">
                  Log
                </Link>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="action-btn delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <SubTasks habitId={habit.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Habits;

