import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  ArrowRight,
  Leaf,
  Calendar,
  Brain
} from 'lucide-react';
import './Landing.css';

function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      {/* Forest Background with Parallax */}
      <div className="forest-background-container">
        <div 
          className="forest-background"
          style={{ 
            transform: `translateY(${scrollY * 0.4}px) scale(${1 + scrollY * 0.0001})`
          }}
        ></div>
        <div className="forest-overlay"></div>
      </div>

      {/* Floating Particles Overlay */}
      <div className="particles-overlay">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="particle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      {/* Floating Leaves */}
      <div className="floating-leaves-container">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i}
            className="floating-leaf"
            style={{
              left: `${10 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          >
            <Leaf size={16 + Math.random() * 8} />
          </div>
        ))}
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Transform Your Life, One Habit at a Time</span>
          </div>
          
          <h1 className="hero-title">
            Build Better Habits,
            <br />
            <span className="gradient-text">Grow Your Future</span>
          </h1>
          
          <p className="hero-description">
            RoutiQ helps you build better habits, watch your growth tree flourish, and achieve your goals 
            with our intelligent habit tracking system. Every completed habit brings you closer to the person you want to become.
          </p>
          
          <div className="hero-cta">
            <Link to="/register" className="cta-primary">
              Get Started Free
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="cta-secondary">
              Sign In
            </Link>
          </div>
          
          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <div className="scroll-mouse">
              <div className="scroll-wheel"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-overlay"></div>
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need to Succeed</h2>
            <p>Powerful features designed to help you build lasting habits</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Leaf size={32} />
              </div>
              <h3>Visual Growth Tree</h3>
              <p>
                Watch your tree grow as you complete habits. Flowers bloom when you 
                achieve perfect days, creating a beautiful visual representation of your progress.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h3>Smart Habit Tracking</h3>
              <p>
                Break down complex habits into manageable sub-tasks. Track completion 
                with a 0-3 scale and build consistency over time.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={32} />
              </div>
              <h3>Mood & Stress Tracking</h3>
              <p>
                Understand how your habits affect your well-being. Track mood and stress 
                levels to identify patterns and optimize your routine.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={32} />
              </div>
              <h3>Weekly Reports</h3>
              <p>
                Get comprehensive insights with beautiful charts. Compare weeks, analyze 
                trends, and celebrate your progress with detailed analytics.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Calendar size={32} />
              </div>
              <h3>Daily Reminders</h3>
              <p>
                Never miss a habit with customizable reminders. Set your preferred time 
                and receive gentle nudges to stay on track.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h3>Consistency Analysis</h3>
              <p>
                Get intelligent feedback on your habits. Our system identifies inconsistent 
                patterns and helps you get back on track with personalized insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-overlay"></div>
        <div className="container">
          <div className="section-header">
            <h2>How RoutiQ Works</h2>
            <p>Start your journey in three simple steps</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Habits</h3>
              <p>
                Define your habits and answer thoughtful questions that help you 
                understand your motivation, obstacles, and goals.
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3>Track Daily Progress</h3>
              <p>
                Log your completions, track your mood, and watch your growth tree 
                flourish as you build consistency.
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3>Analyze & Improve</h3>
              <p>
                Review weekly reports, identify patterns, and use insights to 
                optimize your habit-building journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-overlay"></div>
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Life?</h2>
            <p>Join thousands of people building better habits every day</p>
            <Link to="/register" className="cta-primary large">
              Start Your Journey
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="section-overlay"></div>
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <Leaf size={24} />
              <span>RoutiQ</span>
            </div>
            <div className="footer-links">
              <Link to="/login">Sign In</Link>
              <Link to="/register">Get Started</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 RoutiQ. Built with care for your growth journey.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
