import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Target, BarChart3, Settings, LogOut, Leaf } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Leaf className="brand-icon" size={28} />
        <span className="brand-text">RoutiQ</span>
      </div>
      <div className="navbar-links">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/habits" className={isActive('/habits') ? 'active' : ''}>
          <Target size={20} />
          <span>Habits</span>
        </Link>
        <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>
          <BarChart3 size={20} />
          <span>Reports</span>
        </Link>
        <Link to="/settings" className={isActive('/settings') ? 'active' : ''}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button onClick={logout} className="logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

