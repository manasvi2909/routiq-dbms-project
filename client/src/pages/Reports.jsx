import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import './Reports.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

function Reports() {
  const [currentWeekReport, setCurrentWeekReport] = useState(null);
  const [weeklyComparison, setWeeklyComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(0);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [currentRes, compareRes] = await Promise.all([
        api.get('/reports/weekly'),
        api.get('/reports/weekly/compare?weeks=4')
      ]);

      setCurrentWeekReport(currentRes.data);
      setWeeklyComparison(compareRes.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="reports-loading">Loading...</div>;
  }

  if (!currentWeekReport) {
    return (
      <div className="reports-page">
        <h1>Weekly Reports</h1>
        <div className="no-data">No data available yet. Start logging your habits!</div>
      </div>
    );
  }

  const selectedReport = weeklyComparison[selectedWeek] || currentWeekReport;

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div>
          <h1>Weekly Reports</h1>
          <p className="reports-subtitle">Your RoutiQ progress analytics</p>
        </div>
        <div className="week-selector">
          {weeklyComparison.map((week, index) => (
            <button
              key={index}
              onClick={() => setSelectedWeek(index)}
              className={`week-btn ${selectedWeek === index ? 'active' : ''}`}
            >
              Week {weeklyComparison.length - index}
            </button>
          ))}
        </div>
      </div>

      <div className="reports-summary">
        <div className="summary-card">
          <h3>Total Habits</h3>
          <p className="summary-value">{selectedReport.total_habits}</p>
        </div>
        <div className="summary-card">
          <h3>Consistent Habits</h3>
          <p className="summary-value success">{selectedReport.consistent_habits}</p>
        </div>
        <div className="summary-card">
          <h3>Inconsistent Habits</h3>
          <p className="summary-value warning">{selectedReport.inconsistent_habits}</p>
        </div>
        <div className="summary-card">
          <h3>Total Completions</h3>
          <p className="summary-value">{selectedReport.total_completions}</p>
        </div>
        <div className="summary-card">
          <h3>Average Mood</h3>
          <p className="summary-value">{selectedReport.average_mood || 'N/A'}</p>
        </div>
        <div className="summary-card">
          <h3>Average Stress</h3>
          <p className="summary-value">
            {selectedReport.average_stress ? selectedReport.average_stress.toFixed(1) : 'N/A'}
          </p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h2>RoutiQ Habit Completion Rates</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedReport.habit_completion_data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completions" fill="#667eea" name="Completions" />
              <Bar dataKey="totalDays" fill="#764ba2" name="Total Days" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Mood Distribution in RoutiQ</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={selectedReport.mood_distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {selectedReport.mood_distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Stress Level Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedReport.stress_distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#f093fb" name="Occurrences" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {weeklyComparison.length > 1 && (
        <div className="chart-card">
          <h2>RoutiQ Week-over-Week Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyComparison.map((week, index) => ({
                week: `Week ${weeklyComparison.length - index}`,
                consistent: week.consistent_habits,
                inconsistent: week.inconsistent_habits,
                completions: week.total_completions
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consistent" stroke="#10b981" name="Consistent" />
                <Line type="monotone" dataKey="inconsistent" stroke="#ef4444" name="Inconsistent" />
                <Line type="monotone" dataKey="completions" stroke="#667eea" name="Completions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="habits-breakdown">
        <h2>RoutiQ Habits Breakdown</h2>
        <div className="habits-list">
          {Object.entries(selectedReport.habit_stats || {}).map(([id, stats]) => (
            <div key={id} className="habit-breakdown-card">
              <h3>{stats.name}</h3>
              <div className="breakdown-stats">
                <span>Completions: {stats.completions}</span>
                <span>Total Days: {stats.totalDays}</span>
                <span>Consistency: {stats.totalDays > 0 ? Math.round((stats.completions / stats.totalDays) * 100) : 0}%</span>
              </div>
              {stats.moods.length > 0 && (
                <div className="mood-summary">
                  <strong>Most common mood:</strong> {stats.moods.reduce((a, b, i, arr) => 
                    arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;

