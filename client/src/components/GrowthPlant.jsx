import React from 'react';
import './GrowthPlant.css';

function GrowthPlant({ completionRate = 0 }) {
  // Determine plant stage based on completion rate
  const getPlantStage = () => {
    if (completionRate < 20) return 'seed';
    if (completionRate < 40) return 'sprout';
    if (completionRate < 60) return 'small';
    if (completionRate < 80) return 'medium';
    if (completionRate < 95) return 'large';
    return 'blooming';
  };

  const stage = getPlantStage();
  const percentage = Math.min(completionRate, 100);

  const getPlantEmoji = () => {
    switch (stage) {
      case 'seed': return '🌱';
      case 'sprout': return '🌿';
      case 'small': return '🌳';
      case 'medium': return '🌲';
      case 'large': return '🌴';
      case 'blooming': return '🌸';
      default: return '🌱';
    }
  };

  const getStageName = () => {
    switch (stage) {
      case 'seed': return 'Seedling';
      case 'sprout': return 'Sprout';
      case 'small': return 'Growing';
      case 'medium': return 'Thriving';
      case 'large': return 'Flourishing';
      case 'blooming': return 'Blooming';
      default: return 'Seedling';
    }
  };

  return (
    <div className="growth-plant-container">
      <div className="plant-display">
        <div className="plant-emoji" style={{ fontSize: `${50 + percentage * 0.5}px` }}>
          {getPlantEmoji()}
        </div>
        <div className="plant-info">
          <h3>{getStageName()}</h3>
          <p>{Math.round(percentage)}% Complete</p>
        </div>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="progress-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="plant-message">
        {percentage < 20 && "Keep going! Your plant is just starting to grow."}
        {percentage >= 20 && percentage < 40 && "Great progress! Your plant is sprouting."}
        {percentage >= 40 && percentage < 60 && "You're doing well! Your plant is growing strong."}
        {percentage >= 60 && percentage < 80 && "Amazing! Your plant is thriving."}
        {percentage >= 80 && percentage < 95 && "Incredible! Your plant is flourishing."}
        {percentage >= 95 && "Perfect! Your plant is in full bloom! 🌸"}
      </div>
    </div>
  );
}

export default GrowthPlant;

