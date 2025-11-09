import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TreeModel from '../components/TreeModel';
import { Plus, Target, TrendingUp, Flame } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    activeHabits: 0,
    todayCompletions: 0,
    streak: 0,
    completionRate: 0,
    daysCompleted: 0,
    allHabitsCompletedToday: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [habitsRes, logsRes] = await Promise.all([
        api.get('/habits'),
        api.get('/logs')
      ]);

      const allHabits = habitsRes.data;
      const activeHabits = allHabits.filter(h => h.is_active);
      const today = new Date().toISOString().split('T')[0];
      const todayLogs = logsRes.data.filter(log => log.log_date === today);
      
      // Check if all active habits are completed today (completion_percentage = 3)
      const todayCompletedHabits = todayLogs.filter(log => log.completion_percentage === 3);
      const allHabitsCompletedToday = activeHabits.length > 0 && 
        todayCompletedHabits.length === activeHabits.length;

      // Calculate total completion percentage for tree growth (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLogs = logsRes.data.filter(log => {
        const logDate = new Date(log.log_date);
        return logDate >= sevenDaysAgo && log.completion_percentage > 0;
      });
      
      const totalCompletions = recentLogs.length;
      const totalPossible = activeHabits.length * 7;
      const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;
      
      // Count days with at least one completion
      const uniqueDays = new Set(recentLogs.map(log => log.log_date));
      const daysCompleted = uniqueDays.size;

      setHabits(activeHabits);
      setStats({
        totalHabits: allHabits.length,
        activeHabits: activeHabits.length,
        todayCompletions: todayCompletedHabits.length,
        streak: Math.max(...allHabits.map(h => h.consecutive_days || 0), 0),
        completionRate: Math.min(completionRate, 100),
        daysCompleted,
        allHabitsCompletedToday
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome to RoutiQ</h1>
          <p className="dashboard-subtitle">Your habit tracking dashboard</p>
        </div>
        <Link to="/habits" className="add-habit-btn">
          <Plus size={20} />
          Add Habit
        </Link>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <Target className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.activeHabits}</h3>
              <p>Active Habits</p>
            </div>
          </div>
          <div className="stat-card">
            <TrendingUp className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.todayCompletions}</h3>
              <p>Completed Today</p>
            </div>
          </div>
          <div className="stat-card">
            <Flame className="stat-icon" />
            <div className="stat-info">
              <h3>{stats.streak}</h3>
              <p>Day Streak</p>
            </div>
          </div>
        </div>

        <div className="tree-section">
          <h2>Your RoutiQ Growth Tree</h2>
          <TreeModel 
            completionRate={stats.completionRate}
            daysCompleted={stats.daysCompleted}
            allHabitsCompletedToday={stats.allHabitsCompletedToday}
            weekDay={new Date().getDay()}
          />
        </div>

        <div className="habits-preview">
          <div className="section-header">
            <h2>Your Habits</h2>
            <Link to="/habits">View All</Link>
          </div>
          {habits.length === 0 ? (
            <div className="empty-state">
              <p>No habits yet. Start by adding your first habit to RoutiQ!</p>
              <Link to="/habits" className="primary-btn">
                <Plus size={20} />
                Add Your First Habit
              </Link>
            </div>
          ) : (
            <div className="habits-list">
              {habits.slice(0, 5).map(habit => (
                <div key={habit.id} className="habit-card">
                  <h3>{habit.name}</h3>
                  <p className="habit-stats">
                    {habit.consecutive_days || 0} day streak • {habit.total_completions || 0} total
                  </p>
                  <Link to={`/habits/${habit.id}/log`} className="log-btn">
                    Log Today
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

