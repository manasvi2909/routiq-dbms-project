import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Leaf, Award } from 'lucide-react';
import './TreeModel.css';

function TreeModel({ 
  completionRate = 0, 
  daysCompleted = 0, 
  allHabitsCompletedToday = false,
  weekDay = 0 
}) {
  const canvasRef = useRef(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = 500;
    const height = 600;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    // Animation loop
    let frameCount = 0;
    let animationId;

    const animate = () => {
      frameCount++;
      drawTree(ctx, width, height, frameCount);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [completionRate, daysCompleted, allHabitsCompletedToday]);

  const drawTree = (ctx, width, height, frame) => {
    // Clear canvas with gradient background
    const bgGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width/2);
    bgGradient.addColorStop(0, '#1f4037');
    bgGradient.addColorStop(1, '#0f2027');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Color palette - using your color scheme
    const colors = {
      trunk: '#40534C',
      trunkHighlight: '#4f6359',
      trunkShadow: '#2f3f38',
      leaves: '#677D6A',
      leavesLight: '#7a9280',
      leavesDark: '#556958',
      flower: '#D6BD98',
      flowerCenter: '#c5a97f',
      glow: 'rgba(103, 125, 106, 0.4)',
      particle: 'rgba(214, 189, 152, 0.8)'
    };

    // Calculate tree growth
    const growth = Math.min(completionRate / 100, 1);
    const baseHeight = 80;
    const maxHeight = 420;
    const treeHeight = baseHeight + (growth * (maxHeight - baseHeight));
    const trunkWidth = 25 + (growth * 20);

    // Ground with grass effect
    drawGround(ctx, width, height, colors);

    // Draw trunk with 3D effect
    drawTrunk(ctx, width, height, treeHeight, trunkWidth, colors, frame);

    // Draw branches with organic curves
    if (growth > 0.1) {
      drawBranches(ctx, width, height, treeHeight, growth, colors, frame);
    }

    // Draw foliage clusters
    if (growth > 0.2) {
      drawFoliage(ctx, width, height, treeHeight, growth, colors, frame);
    }

    // Draw flowers when habits completed
    if (allHabitsCompletedToday && growth > 0.4) {
      drawFlowers(ctx, width, height, treeHeight, daysCompleted, colors, frame);
    }

    // Draw particles/sparkles
    if (allHabitsCompletedToday) {
      drawParticles(ctx, width, height, colors, frame);
    }

    // Draw roots
    drawRoots(ctx, width, height, growth, colors);
  };

  const drawGround = (ctx, width, height, colors) => {
    // Ground base
    const groundY = height - 80;
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
    groundGradient.addColorStop(0, colors.trunk);
    groundGradient.addColorStop(1, colors.trunkShadow);
    
    ctx.fillStyle = groundGradient;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    // Grass blades
    ctx.strokeStyle = colors.leaves;
    ctx.lineWidth = 2;
    for (let i = 0; i < 40; i++) {
      const x = (i / 40) * width;
      const grassHeight = 8 + Math.random() * 12;
      ctx.beginPath();
      ctx.moveTo(x, groundY);
      ctx.quadraticCurveTo(x + 2, groundY - grassHeight/2, x + 4, groundY - grassHeight);
      ctx.stroke();
    }
  };

  const drawRoots = (ctx, width, height, growth, colors) => {
    const centerX = width / 2;
    const groundY = height - 80;
    const rootCount = 3 + Math.floor(growth * 2);

    ctx.strokeStyle = colors.trunkShadow;
    ctx.lineWidth = 3;

    for (let i = 0; i < rootCount; i++) {
      const angle = (Math.PI / (rootCount + 1)) * (i + 1);
      const direction = i % 2 === 0 ? 1 : -1;
      const length = 40 + growth * 30;

      ctx.beginPath();
      ctx.moveTo(centerX, groundY);
      
      const cp1x = centerX + direction * 20;
      const cp1y = groundY + 10;
      const cp2x = centerX + direction * (length * 0.7);
      const cp2y = groundY + 20;
      const endX = centerX + direction * length;
      const endY = groundY + 30;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      ctx.stroke();
    }
  };

  const drawTrunk = (ctx, width, height, treeHeight, trunkWidth, colors, frame) => {
    const centerX = width / 2;
    const groundY = height - 80;
    const topY = groundY - treeHeight;

    // Trunk shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(centerX + 5, groundY + 5, trunkWidth/2 + 2, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main trunk with gradient
    const trunkGradient = ctx.createLinearGradient(
      centerX - trunkWidth/2, groundY,
      centerX + trunkWidth/2, groundY
    );
    trunkGradient.addColorStop(0, colors.trunkShadow);
    trunkGradient.addColorStop(0.4, colors.trunk);
    trunkGradient.addColorStop(0.6, colors.trunkHighlight);
    trunkGradient.addColorStop(1, colors.trunk);

    ctx.fillStyle = trunkGradient;
    ctx.beginPath();
    ctx.moveTo(centerX - trunkWidth/2, groundY);
    ctx.bezierCurveTo(
      centerX - trunkWidth/2, topY + 50,
      centerX - trunkWidth/3, topY + 20,
      centerX - trunkWidth/4, topY
    );
    ctx.lineTo(centerX + trunkWidth/4, topY);
    ctx.bezierCurveTo(
      centerX + trunkWidth/3, topY + 20,
      centerX + trunkWidth/2, topY + 50,
      centerX + trunkWidth/2, groundY
    );
    ctx.closePath();
    ctx.fill();

    // Bark texture
    ctx.strokeStyle = colors.trunkShadow;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const y = groundY - (treeHeight * (i / 8));
      const offset = Math.sin(frame / 100 + i) * 2;
      ctx.beginPath();
      ctx.moveTo(centerX - trunkWidth/3 + offset, y);
      ctx.lineTo(centerX + trunkWidth/3 + offset, y - 5);
      ctx.stroke();
    }

    // Highlight edge
    ctx.strokeStyle = colors.trunkHighlight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX + trunkWidth/4, topY);
    ctx.bezierCurveTo(
      centerX + trunkWidth/3, topY + 20,
      centerX + trunkWidth/2 - 2, topY + 50,
      centerX + trunkWidth/2 - 2, groundY
    );
    ctx.stroke();
  };

  const drawBranches = (ctx, width, height, treeHeight, growth, colors, frame) => {
    const centerX = width / 2;
    const groundY = height - 80;
    const branchCount = Math.floor(growth * 6) + 2;

    for (let i = 0; i < branchCount; i++) {
      const t = i / branchCount;
      const branchY = groundY - treeHeight * (0.3 + t * 0.6);
      const side = i % 2 === 0 ? 1 : -1;
      const length = 60 + growth * 80 - (i * 8);
      const thickness = 8 - (i * 0.8);
      const sway = Math.sin(frame / 60 + i) * 2;

      // Branch gradient
      const branchGradient = ctx.createLinearGradient(
        centerX, branchY,
        centerX + side * length, branchY - 40
      );
      branchGradient.addColorStop(0, colors.trunk);
      branchGradient.addColorStop(1, colors.trunkShadow);

      ctx.strokeStyle = branchGradient;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(centerX, branchY);
      ctx.quadraticCurveTo(
        centerX + side * (length * 0.5) + sway,
        branchY - 20,
        centerX + side * length + sway,
        branchY - 40
      );
      ctx.stroke();

      // Secondary branches
      if (growth > 0.5) {
        const secondaryCount = 2;
        for (let j = 0; j < secondaryCount; j++) {
          const subT = (j + 1) / (secondaryCount + 1);
          const subStartX = centerX + side * length * subT + sway;
          const subStartY = branchY - 40 * subT;
          const subLength = 30 + growth * 20;

          ctx.lineWidth = thickness * 0.5;
          ctx.beginPath();
          ctx.moveTo(subStartX, subStartY);
          ctx.quadraticCurveTo(
            subStartX + side * (subLength * 0.5),
            subStartY - 10,
            subStartX + side * subLength,
            subStartY - 20
          );
          ctx.stroke();
        }
      }
    }
  };

  const drawFoliage = (ctx, width, height, treeHeight, growth, colors, frame) => {
    const centerX = width / 2;
    const groundY = height - 80;
    const topY = groundY - treeHeight;
    const foliageSize = 80 + growth * 100;

    // Draw leaf clusters
    const clusters = [
      { x: 0, y: 0, size: 1.2 },
      { x: -60, y: 40, size: 0.9 },
      { x: 60, y: 40, size: 0.9 },
      { x: -40, y: 80, size: 0.7 },
      { x: 40, y: 80, size: 0.7 },
      { x: -80, y: 120, size: 0.6 },
      { x: 80, y: 120, size: 0.6 }
    ];

    clusters.forEach((cluster, index) => {
      if (growth < 0.3 + (index * 0.1)) return;

      const clusterX = centerX + cluster.x * growth;
      const clusterY = topY + cluster.y * growth;
      const clusterSize = foliageSize * cluster.size * growth;
      const sway = Math.sin(frame / 80 + index) * 3;

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(
        clusterX + 5 + sway,
        clusterY + 5,
        clusterSize * 0.5,
        clusterSize * 0.4,
        0, 0, Math.PI * 2
      );
      ctx.fill();

      // Main foliage
      const leafGradient = ctx.createRadialGradient(
        clusterX - clusterSize * 0.2 + sway,
        clusterY - clusterSize * 0.2,
        0,
        clusterX + sway,
        clusterY,
        clusterSize * 0.6
      );
      leafGradient.addColorStop(0, colors.leavesLight);
      leafGradient.addColorStop(0.6, colors.leaves);
      leafGradient.addColorStop(1, colors.leavesDark);

      ctx.fillStyle = leafGradient;
      ctx.beginPath();
      ctx.ellipse(
        clusterX + sway,
        clusterY,
        clusterSize * 0.5,
        clusterSize * 0.4,
        Math.PI / 6,
        0, Math.PI * 2
      );
      ctx.fill();

      // Individual leaves
      const leafCount = Math.floor(10 * cluster.size);
      for (let i = 0; i < leafCount; i++) {
        const angle = (i / leafCount) * Math.PI * 2;
        const radius = clusterSize * 0.4;
        const leafX = clusterX + Math.cos(angle) * radius + sway;
        const leafY = clusterY + Math.sin(angle) * radius * 0.7;
        const leafSize = 6 + Math.random() * 4;

                ctx.fillStyle = i % 2 === 0 ? colors.leaves : colors.leavesLight;
        ctx.beginPath();
        ctx.ellipse(leafX, leafY, leafSize, leafSize * 0.6, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glow effect on top cluster
      if (index === 0 && allHabitsCompletedToday) {
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = 20;
        ctx.fillStyle = 'rgba(103, 125, 106, 0.1)';
        ctx.beginPath();
        ctx.arc(clusterX + sway, clusterY, clusterSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  };

  const drawFlowers = (ctx, width, height, treeHeight, daysCompleted, colors, frame) => {
    const centerX = width / 2;
    const groundY = height - 80;
    const topY = groundY - treeHeight;
    const flowerCount = Math.min(Math.floor(daysCompleted / 3) + 3, 12);

    const flowerPositions = [
      { x: 0, y: -20 },
      { x: -50, y: 10 },
      { x: 50, y: 10 },
      { x: -70, y: 50 },
      { x: 70, y: 50 },
      { x: -30, y: 70 },
      { x: 30, y: 70 },
      { x: -90, y: 90 },
      { x: 90, y: 90 },
      { x: 0, y: 100 },
      { x: -60, y: 120 },
      { x: 60, y: 120 }
    ];

    for (let i = 0; i < Math.min(flowerCount, flowerPositions.length); i++) {
      const pos = flowerPositions[i];
      const flowerX = centerX + pos.x;
      const flowerY = topY + pos.y;
      const petalSize = 8 + Math.random() * 4;
      const petalCount = 5;
      const rotation = (frame / 100 + i) * 0.05;
      const pulse = Math.sin(frame / 30 + i) * 0.1 + 1;

      // Flower shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(flowerX + 2, flowerY + 2, petalSize * 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Petals
      for (let p = 0; p < petalCount; p++) {
        const angle = (p / petalCount) * Math.PI * 2 + rotation;
        const petalX = flowerX + Math.cos(angle) * petalSize * pulse;
        const petalY = flowerY + Math.sin(angle) * petalSize * pulse;

        const petalGradient = ctx.createRadialGradient(
          petalX, petalY, 0,
          petalX, petalY, petalSize
        );
        petalGradient.addColorStop(0, colors.flower);
        petalGradient.addColorStop(1, colors.flowerCenter);

        ctx.fillStyle = petalGradient;
        ctx.beginPath();
        ctx.ellipse(petalX, petalY, petalSize * 0.8, petalSize * 1.2, angle, 0, Math.PI * 2);
        ctx.fill();
      }

      // Flower center
      const centerGradient = ctx.createRadialGradient(
        flowerX, flowerY, 0,
        flowerX, flowerY, petalSize * 0.4
      );
      centerGradient.addColorStop(0, colors.flowerCenter);
      centerGradient.addColorStop(1, colors.flower);

      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(flowerX, flowerY, petalSize * 0.4 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Flower highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(flowerX - 2, flowerY - 2, petalSize * 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      ctx.shadowColor = colors.flower;
      ctx.shadowBlur = 15;
      ctx.fillStyle = 'rgba(214, 189, 152, 0.1)';
      ctx.beginPath();
      ctx.arc(flowerX, flowerY, petalSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  };

  const drawParticles = (ctx, width, height, colors, frame) => {
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.sin(frame / 50 + i * 2) * 0.5 + 0.5) * width;
      const y = ((frame + i * 50) % 500) - 100;
      const size = 2 + Math.sin(frame / 20 + i) * 1;
      const opacity = Math.sin(frame / 30 + i) * 0.5 + 0.5;

      ctx.fillStyle = `rgba(214, 189, 152, ${opacity * 0.6})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();

      // Sparkle effect
      if (opacity > 0.7) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - size * 2, y);
        ctx.lineTo(x + size * 2, y);
        ctx.moveTo(x, y - size * 2);
        ctx.lineTo(x, y + size * 2);
        ctx.stroke();
      }
    }
  };

  const getGrowthStage = () => {
    if (completionRate < 15) return { name: 'Seedling', emoji: '🌱' };
    if (completionRate < 30) return { name: 'Sprouting', emoji: '🌿' };
    if (completionRate < 50) return { name: 'Growing', emoji: '🌳' };
    if (completionRate < 70) return { name: 'Thriving', emoji: '🌲' };
    if (completionRate < 90) return { name: 'Flourishing', emoji: '🌴' };
    return { name: 'Blooming', emoji: '🌸' };
  };

  const stage = getGrowthStage();

  return (
    <div className="tree-model-container">
      {/* Animated background elements */}
      <div className="tree-bg-elements">
        <div className="tree-bg-circle circle-1"></div>
        <div className="tree-bg-circle circle-2"></div>
        <div className="tree-bg-circle circle-3"></div>
      </div>

      {/* Main canvas */}
      <div className="tree-canvas-wrapper">
        <canvas ref={canvasRef} className="tree-canvas" />
      </div>

      {/* Info section */}
      <div className="tree-info-section">
        <div className="tree-stage-badge">
          <span className="stage-emoji">{stage.emoji}</span>
          <span className="stage-name">{stage.name}</span>
        </div>

        <div className="tree-stats-grid">
          <div className="tree-stat-item">
            <div className="stat-icon-wrapper">
              <Award size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{Math.round(completionRate)}%</span>
              <span className="stat-label">Complete</span>
            </div>
          </div>

          <div className="tree-stat-item">
            <div className="stat-icon-wrapper">
              <Leaf size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{daysCompleted}</span>
              <span className="stat-label">Days Active</span>
            </div>
          </div>

          {allHabitsCompletedToday && (
            <div className="tree-stat-item achievement">
              <div className="stat-icon-wrapper sparkle">
                <Sparkles size={20} />
              </div>
              <div className="stat-content">
                <span className="stat-label achievement-text">Perfect Day!</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="tree-progress-bar">
          <div 
            className="tree-progress-fill" 
            style={{ width: `${Math.min(completionRate, 100)}%` }}
          >
            <div className="progress-shine"></div>
          </div>
          <div className="progress-markers">
            <span className="progress-marker" style={{ left: '0%' }}>0%</span>
            <span className="progress-marker" style={{ left: '25%' }}>25%</span>
            <span className="progress-marker" style={{ left: '50%' }}>50%</span>
            <span className="progress-marker" style={{ left: '75%' }}>75%</span>
            <span className="progress-marker" style={{ left: '100%' }}>100%</span>
          </div>
        </div>

        {/* Motivational message */}
        <div className="tree-message">
          {completionRate < 15 && "🌱 Your journey begins! Plant the seeds of success."}
          {completionRate >= 15 && completionRate < 30 && "🌿 Great start! Your habits are taking root."}
          {completionRate >= 30 && completionRate < 50 && "🌳 Keep going! Your tree is growing stronger."}
          {completionRate >= 50 && completionRate < 70 && "🌲 Excellent progress! Your dedication shows."}
          {completionRate >= 70 && completionRate < 90 && "🌴 Amazing! Your habits are flourishing."}
          {completionRate >= 90 && "🌸 Outstanding! You've achieved greatness!"}
        </div>
      </div>
    </div>
  );
}

export default TreeModel;

