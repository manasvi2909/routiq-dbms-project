import React, { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import './TreeModel.css';

function TreeModel({ 
  completionRate = 0, 
  daysCompleted = 0, 
  allHabitsCompletedToday = false,
  weekDay = 0 
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = 400;
    const height = canvas.height = 500;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Color palette
    const colors = {
      trunk: '#40534C', // FOREST ROAST
      trunkLight: '#677D6A', // MATCHA BREW
      leaves: '#677D6A', // MATCHA BREW
      leavesDark: '#40534C', // FOREST ROAST
      flower: '#D6BD98', // ALMOND
      flowerCenter: '#677D6A', // MATCHA BREW
      background: '#1A3636', // ECLIPSE
      ground: '#40534C' // FOREST ROAST
    };

    // Calculate tree dimensions based on completion
    const baseHeight = 100;
    const maxHeight = 350;
    const treeHeight = baseHeight + (completionRate / 100) * (maxHeight - baseHeight);
    const trunkWidth = 20 + (completionRate / 100) * 15;
    
    // Ground
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, height - 50, width, 50);

    // Trunk
    const trunkX = width / 2;
    const trunkY = height - 50;
    
    // Draw trunk with gradient
    const trunkGradient = ctx.createLinearGradient(trunkX - trunkWidth/2, trunkY, trunkX + trunkWidth/2, trunkY - treeHeight);
    trunkGradient.addColorStop(0, colors.trunk);
    trunkGradient.addColorStop(1, colors.trunkLight);
    
    ctx.fillStyle = trunkGradient;
    ctx.fillRect(trunkX - trunkWidth/2, trunkY - treeHeight, trunkWidth, treeHeight);

    // Branches and leaves
    const leafCount = Math.floor(completionRate / 10) + 3;
    const branchLevels = Math.floor(treeHeight / 80);
    
    for (let i = 0; i < branchLevels; i++) {
      const branchY = trunkY - treeHeight + (i * 80) + 40;
      const branchLength = 40 + (completionRate / 100) * 60;
      
      // Left branch
      ctx.strokeStyle = colors.trunk;
      ctx.lineWidth = 8 - (i * 0.5);
      ctx.beginPath();
      ctx.moveTo(trunkX, branchY);
      ctx.lineTo(trunkX - branchLength, branchY - 20);
      ctx.stroke();
      
      // Right branch
      ctx.beginPath();
      ctx.moveTo(trunkX, branchY);
      ctx.lineTo(trunkX + branchLength, branchY - 20);
      ctx.stroke();
      
      // Leaves on branches
      for (let j = 0; j < leafCount; j++) {
        const leafX = trunkX + (j % 2 === 0 ? -1 : 1) * (branchLength * 0.6 + (j * 15));
        const leafY = branchY - 20 + (j * 8);
        const leafSize = 15 + (completionRate / 100) * 10;
        
        // Draw leaf
        ctx.fillStyle = colors.leaves;
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, leafSize, leafSize * 0.7, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Leaf highlight
        ctx.fillStyle = colors.leavesDark;
        ctx.beginPath();
        ctx.ellipse(leafX - 3, leafY - 3, leafSize * 0.6, leafSize * 0.4, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Flowers if all habits completed today
    if (allHabitsCompletedToday && treeHeight > 150) {
      const flowerCount = Math.min(3, Math.floor(daysCompleted / 7) + 1);
      
      for (let i = 0; i < flowerCount; i++) {
        const flowerX = trunkX + (i % 2 === 0 ? -1 : 1) * (30 + (i * 20));
        const flowerY = trunkY - treeHeight + 100 + (i * 40);
        
        // Petals
        ctx.fillStyle = colors.flower;
        for (let p = 0; p < 5; p++) {
          const angle = (p * 2 * Math.PI) / 5;
          const petalX = flowerX + Math.cos(angle) * 12;
          const petalY = flowerY + Math.sin(angle) * 12;
          
          ctx.beginPath();
          ctx.ellipse(petalX, petalY, 8, 12, angle, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        // Center
        ctx.fillStyle = colors.flowerCenter;
        ctx.beginPath();
        ctx.arc(flowerX, flowerY, 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Add subtle animation
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = colors.leaves;
    ctx.beginPath();
    ctx.arc(trunkX, trunkY - treeHeight, 50, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();

  }, [completionRate, daysCompleted, allHabitsCompletedToday, weekDay]);

  return (
    <div className="tree-model-container">
      <canvas ref={canvasRef} className="tree-canvas" />
      <div className="tree-info">
        <div className="tree-stats">
          <span className="stat-item">
            <strong>{Math.round(completionRate)}%</strong> Complete
          </span>
          <span className="stat-item">
            <strong>{daysCompleted}</strong> Days
          </span>
          {allHabitsCompletedToday && (
            <span className="stat-item flower-indicator">
              <Sparkles size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
              Flower Bloomed!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default TreeModel;

