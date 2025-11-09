import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './LogHabit.css';

function LogHabit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    completion_percentage: 0,
    mood: '',
    stress_level: null,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHabit();
  }, [id]);

  const fetchHabit = async () => {
    try {
      const response = await api.get(`/habits/${id}`);
      setHabit(response.data);
    } catch (error) {
      console.error('Error fetching habit:', error);
      alert('Habit not found');
      navigate('/habits');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await api.post('/logs', {
        habit_id: parseInt(id),
        log_date: today,
        ...formData
      });

      // Also log mood separately if provided
      if (formData.mood) {
        try {
          await api.post('/mood', {
            log_date: today,
            mood: formData.mood,
            stress_level: formData.stress_level,
            notes: formData.notes
          });
        } catch (error) {
          console.error('Error logging mood:', error);
        }
      }

      alert('Habit logged successfully!');
      navigate('/habits');
    } catch (error) {
      console.error('Error logging habit:', error);
      alert('Error logging habit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="log-loading">Loading...</div>;
  }

  if (!habit) {
    return null;
  }

  return (
    <div className="log-habit-page">
      <div className="log-container">
        <div className="log-header">
          <h1>Log: {habit.name}</h1>
          <p className="log-subtitle">Track your progress in RoutiQ</p>
        </div>
        
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="log-step">
              <h2>Completion</h2>
              <p>How much of this habit did you complete today?</p>
              <div className="completion-scale">
                {[0, 1, 2, 3].map(value => (
                  <label key={value} className={`scale-option ${formData.completion_percentage === value ? 'checked' : ''}`}>
                    <input
                      type="radio"
                      name="completion"
                      value={value}
                      checked={formData.completion_percentage === value}
                      onChange={(e) => setFormData({ ...formData, completion_percentage: parseInt(e.target.value) })}
                    />
                    <div className="scale-label">
                      <span className="scale-value">{value}</span>
                      <span className="scale-desc">
                        {value === 0 ? 'Not started' : value === 1 ? '25%' : value === 2 ? '50%' : '100%'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              <button type="button" onClick={handleNext} className="next-btn">
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="log-step">
              <h2>Mood & Stress</h2>
              <p>How did you feel while doing this habit? RoutiQ tracks this to help you understand patterns.</p>
              
              <div className="form-group">
                <label>Mood</label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="mood-select"
                >
                  <option value="">Select mood</option>
                  <option value="Happy">Happy</option>
                  <option value="Calm">Calm</option>
                  <option value="Energetic">Energetic</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Tired">Tired</option>
                  <option value="Stressed">Stressed</option>
                  <option value="Anxious">Anxious</option>
                  <option value="Sad">Sad</option>
                </select>
              </div>

              <div className="form-group">
                <label>Stress Level (1-5)</label>
                <div className="stress-scale">
                  {[1, 2, 3, 4, 5].map(level => (
                    <label key={level} className={`stress-option ${formData.stress_level === level ? 'checked' : ''}`}>
                      <input
                        type="radio"
                        name="stress"
                        value={level}
                        checked={formData.stress_level === level}
                        onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
                      />
                      <span>{level}</span>
                    </label>
                  ))}
                </div>
                <div className="stress-labels">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              <div className="button-group">
                <button type="button" onClick={handleBack} className="back-btn">
                  Back
                </button>
                <button type="button" onClick={handleNext} className="next-btn">
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="log-step">
              <h2>Notes (Optional)</h2>
              <p>Add any additional notes about today's habit completion in RoutiQ</p>
              
              <div className="form-group">
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How did it go? What did you learn?"
                  rows="5"
                  className="notes-textarea"
                />
              </div>

              <div className="button-group">
                <button type="button" onClick={handleBack} className="back-btn">
                  Back
                </button>
                <button type="submit" disabled={submitting} className="submit-btn">
                  {submitting ? 'Logging...' : 'Log Habit'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default LogHabit;

