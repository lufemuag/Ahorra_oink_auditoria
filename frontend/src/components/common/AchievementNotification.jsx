import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaStar, FaBullseye, FaGem, FaCrown, FaChartLine, FaSun, FaTimes } from 'react-icons/fa';
import './AchievementNotification.css';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Mostrar la notificación con animación
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 100);

    // Auto-cerrar después de 5 segundos
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const getAchievementIcon = (iconName) => {
    const icons = {
      FaTrophy: FaTrophy,
      FaMedal: FaMedal,
      FaStar: FaStar,
      FaBullseye: FaBullseye,
      FaGem: FaGem,
      FaCrown: FaCrown,
      FaChartLine: FaChartLine,
      FaSun: FaSun
    };
    return icons[iconName] || FaTrophy;
  };

  const getAchievementColor = (category) => {
    const colors = {
      savings: '#27AE60',
      streak: '#F39C12',
      goals: '#E74C3C',
      budget: '#9B59B6',
      habits: '#3498DB'
    };
    return colors[category] || '#27AE60';
  };

  if (!isVisible) return null;

  const Icon = getAchievementIcon(achievement.icon);
  const color = getAchievementColor(achievement.category);

  return (
    <div className={`achievement-notification ${isAnimating ? 'animate-in' : 'animate-out'}`}>
      <div className="achievement-notification-content" style={{ borderLeftColor: color }}>
        <div className="achievement-icon-container" style={{ backgroundColor: color }}>
          <Icon className="achievement-icon" />
        </div>
        
        <div className="achievement-info">
          <div className="achievement-header">
            <h3 className="achievement-title">¡Logro Desbloqueado!</h3>
            <button 
              className="achievement-close"
              onClick={handleClose}
              aria-label="Cerrar notificación"
            >
              <FaTimes />
            </button>
          </div>
          
          <div className="achievement-details">
            <h4 className="achievement-name" style={{ color: color }}>
              {achievement.name}
            </h4>
            <p className="achievement-description">
              {achievement.description}
            </p>
            <div className="achievement-reward">
              <span className="achievement-points">+{achievement.points} puntos</span>
              <span className="achievement-badge">{achievement.reward.value}</span>
            </div>
          </div>
        </div>
        
        <div className="achievement-celebration">
          <div className="confetti confetti-1"></div>
          <div className="confetti confetti-2"></div>
          <div className="confetti confetti-3"></div>
          <div className="confetti confetti-4"></div>
          <div className="confetti confetti-5"></div>
        </div>
      </div>
    </div>
  );
};

export default AchievementNotification;


