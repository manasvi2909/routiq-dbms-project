import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TreeModel from '../components/TreeModel';
import { Plus, Target, TrendingUp, Flame, Calendar, Award, Zap, BarChart3, CheckCircle } from 'lucide-react';
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
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
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
      
      const todayCompletedHabits = todayLogs.filter(log => log.completion_percentage === 3);
      const allHabitsCompletedToday = activeHabits.length > 0 && 
        todayCompletedHabits.length === activeHabits.length;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLogs = logsRes.data.filter(log => {
        const logDate = new Date(log.log_date);
        return logDate >= sevenDaysAgo && log.completion_percentage > 0;
      });
      
      const totalCompletions = recentLogs.length;
      const totalPossible = activeHabits.length * 7;
      const completionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;
      
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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Small steps every day",
      "Progress, not perfection",
      "You're building your future",
      "Consistency is key",
      "One habit at a time"
    ];
    return quotes[Math.floor(stats.completionRate / 20) % quotes.length];
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader"></div>
        <p>Loading your RoutiQ journey...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-unique">
      {/* Floating Particles Background */}
      <div className="dashboard-particles">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Hero Header - FIXED */}
      <div className="dashboard-hero">
        <div className="hero-left">
          <h1 className="greeting">{getGreeting()}!</h1>
          <p className="motivational-quote">{getMotivationalQuote()}</p>
          <div className="time-display">
            <Calendar size={16} />
            <span>{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="hero-right">
          <Link to="/habits" className="hero-add-btn">
            <Plus size={20} />
            <span>Add Habit</span>
          </Link>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Stats Row - SIMPLIFIED ICONS */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Flame size={26} />
            </div>
            <div className="stat-content">
              <h3>{stats.streak}</h3>
              <p>Day Streak</p>
              <div className="stat-progress">
                <div 
                  className="progress-fill" 
                  style={{ width: `${Math.min((stats.streak / 30) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Target size={26} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeHabits}</h3>
              <p>Active Habits</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <Zap size={26} />
            </div>
            <div className="stat-content">
              <h3>{stats.todayCompletions}</h3>
              <p>Completed Today</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper">
              <TrendingUp size={26} />
            </div>
            <div className="stat-content">
              <h3>{Math.round(stats.completionRate)}%</h3>
              <p>Weekly Rate</p>
            </div>
          </div>
        </div>

               {/* Main Content - PERFECT GRID LAYOUT */}
               <div className="content-grid">
          {/* Left Column - Tree */}
          <div className="tree-section">
            <div className="section-title">
              <h2>Your Growth Tree</h2>
              <div className="completion-badge">
                {Math.round(stats.completionRate)}%
              </div>
            </div>
            <div className="tree-container">
              <TreeModel 
                completionRate={stats.completionRate}
                daysCompleted={stats.daysCompleted}
                allHabitsCompletedToday={stats.allHabitsCompletedToday}
                weekDay={new Date().getDay()}
              />
            </div>
            <div className="tree-info">
              <div className="tree-stat-item">
                <Award size={16} />
                <span>{stats.daysCompleted} days of growth</span>
              </div>
              {stats.allHabitsCompletedToday && (
                <div className="tree-stat-item completed-badge">
                  <CheckCircle size={16} />
                  <span>All habits completed today!</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions + Your Habits */}
          <div className="right-column">
            {/* Quick Actions */}
            <div className="quick-actions-card">
              <h3>Quick Actions</h3>
              <div className="actions-list">
                <Link to="/habits" className="action-btn">
                  <Target size={20} />
                  <span>Manage Habits</span>
                </Link>
                <Link to="/reports" className="action-btn">
                  <BarChart3 size={20} />
                  <span>View Reports</span>
                </Link>
              </div>
            </div>

            {/* Your Habits - Compact */}
            <div className="habits-compact">
              <div className="section-header-compact">
                <h3>Your Habits</h3>
                <Link to="/habits" className="view-all-link">View All →</Link>
              </div>

              {habits.length === 0 ? (
                <div className="empty-state-compact">
                  <div className="empty-icon-small">
                    <Target size={32} />
                  </div>
                  <p>No habits yet</p>
                  <Link to="/habits" className="start-link">
                    <Plus size={16} />
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="habits-list-compact">
                  {habits.slice(0, 3).map(habit => (
                    <div key={habit.id} className="habit-item-compact">
                      <div className="habit-item-header">
                        <h4>{habit.name}</h4>
                        {habit.consecutive_days > 0 && (
                          <div className="habit-streak-small">
                            <Flame size={12} />
                            <span>{habit.consecutive_days}</span>
                          </div>
                        )}
                      </div>
                      <div className="habit-item-footer">
                        <span className="habit-count">{habit.total_completions || 0} completions</span>
                        <Link to={`/habits/${habit.id}/log`} className="log-link">
                          Log →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
