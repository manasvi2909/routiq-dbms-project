import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './AddHabit.css';

function AddHabit() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    when_specifically: '',
    what_motivating: '',
    what_hindering: '',
    whom_tell: '',
    who_inspires: '',
    milestones: '',
    treat_myself: ''
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 4) {
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
    setLoading(true);

    try {
      await api.post('/habits', formData);
      alert('Habit created successfully!');
      navigate('/habits');
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Error creating habit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-habit-page">
      <div className="add-habit-container">
        <div className="add-habit-header">
          <h1>Create New Habit</h1>
          <p className="add-habit-subtitle">Add a new habit to your RoutiQ routine</p>
        </div>
        
        <div className="progress-indicator">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 4 ? 'active' : ''}`}>4</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>
              <p className="step-description">Let's start building your RoutiQ habit</p>
              <div className="form-group">
                <label>Habit Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Morning Meditation"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of your habit"
                  rows="3"
                />
              </div>
              <button type="button" onClick={handleNext} className="next-btn">
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>Planning & Motivation</h2>
              <div className="form-group">
                <label>When Specifically? *</label>
                <textarea
                  value={formData.when_specifically}
                  onChange={(e) => setFormData({ ...formData, when_specifically: e.target.value })}
                  required
                  placeholder="Plan A: Do everything right after waking up and before starting to work. Plan B: Do what's left before bed."
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>What's Motivating Me? *</label>
                <textarea
                  value={formData.what_motivating}
                  onChange={(e) => setFormData({ ...formData, what_motivating: e.target.value })}
                  required
                  placeholder="e.g., stronger immune-system, more calmness and energy during the day, personal development and progress"
                  rows="4"
                />
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
            <div className="form-step">
              <h2>Challenges & Support</h2>
              <p className="step-description">RoutiQ helps you overcome obstacles</p>
              <div className="form-group">
                <label>What's Hindering Me?</label>
                <textarea
                  value={formData.what_hindering}
                  onChange={(e) => setFormData({ ...formData, what_hindering: e.target.value })}
                  placeholder="e.g., Having a Cold, Traveling and not being home, early meetings, being in a hurry"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Whom Do I Tell? (Accountability)</label>
                <input
                  type="text"
                  value={formData.whom_tell}
                  onChange={(e) => setFormData({ ...formData, whom_tell: e.target.value })}
                  placeholder="e.g., Colleagues Andreas & Tina, Family"
                />
              </div>
              <div className="form-group">
                <label>Who Inspires Me?</label>
                <input
                  type="text"
                  value={formData.who_inspires}
                  onChange={(e) => setFormData({ ...formData, who_inspires: e.target.value })}
                  placeholder="e.g., My Dad: Swims in Ice Water every Morning, James Clear: Master of Habits"
                />
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

          {step === 4 && (
            <div className="form-step">
              <h2>Goals & Rewards</h2>
              <p className="step-description">Set milestones and celebrate with RoutiQ</p>
              <div className="form-group">
                <label>My Milestones Are:</label>
                <textarea
                  value={formData.milestones}
                  onChange={(e) => setFormData({ ...formData, milestones: e.target.value })}
                  placeholder="e.g., 10 days without missing twice, 20 days without missing twice"
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>I'm Gonna Treat Myself With:</label>
                <input
                  type="text"
                  value={formData.treat_myself}
                  onChange={(e) => setFormData({ ...formData, treat_myself: e.target.value })}
                  placeholder="e.g., Thai Massage, Day at the Spa, Eating Out Korean Food"
                />
              </div>
              <div className="button-group">
                <button type="button" onClick={handleBack} className="back-btn">
                  Back
                </button>
                <button type="submit" disabled={loading} className="submit-btn">
                  {loading ? 'Creating...' : 'Create Habit'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddHabit;

