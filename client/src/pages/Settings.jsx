import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Bell, Clock, Check } from 'lucide-react';
import './Settings.css';

function Settings() {
  const [reminderTime, setReminderTime] = useState('09:00');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/auth/me');
      // Note: You may need to add these fields to the user response
      // For now, using defaults
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);

    try {
      await api.put('/auth/reminder-settings', {
        reminder_time: reminderTime,
        reminder_enabled: reminderEnabled
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      <div className="settings-card">
        <div className="settings-header">
          <Bell className="settings-icon" />
          <div>
            <h2>Reminders & Notifications</h2>
            <p>Configure when you receive daily reminders</p>
          </div>
        </div>

        <div className="settings-content">
          <div className="setting-item">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Enable Daily Reminders</span>
            </label>
          </div>

          {reminderEnabled && (
            <div className="setting-item">
              <label>
                <Clock size={20} />
                Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="time-input"
              />
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading}
            className="save-btn"
          >
            {loading ? 'Saving...' : saved ? (
              <>
                <Check size={18} />
                Saved
              </>
            ) : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-header">
          <div>
            <h2>About RoutiQ</h2>
            <p>Your Personal Growth Companion</p>
          </div>
        </div>
        <div className="settings-content">
          <p>
            RoutiQ helps you track your habits, monitor your mood, and watch your growth tree flourish
            as you build consistency in your daily routines. Every habit you complete brings you closer
            to becoming the person you want to be.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;

