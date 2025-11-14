import React, { useState, useEffect } from 'react';
import {
  FaTrophy, FaMedal, FaStar, FaBullseye, FaGem, FaCrown, FaChartLine, FaSun, FaTimes
} from 'react-icons/fa';
import './AchievementNotification.css';

const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // --- Helpers: icono y color por categoría ---
  const getAchievementIcon = (iconName) => {
    const icons = {
      FaTrophy, FaMedal, FaStar, FaBullseye, FaGem, FaCrown, FaChartLine, FaSun
    };
    return icons[iconName] || FaTrophy;
  };

  const getAchievementColor = (category) => {
    const colors = {
      savings: '#27AE60',
      streak:  '#F39C12',
      goals:   '#E74C3C',
      budget:  '#9B59B6',
      habits:  '#3498DB'
    };
    return colors[category] || '#27AE60';
  };

  const Icon  = getAchievementIcon(achievement?.icon);
  const color = getAchievementColor(achievement?.category);

  // --- Mostrar/ocultar con animación + autocierre + bloquear scroll ---
  useEffect(() => {
    if (!achievement) return;

    // Bloquear el scroll del body mientras está el overlay
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Mostrar con pequeña demora para activar animación CSS
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 100);

    // Autocerrar a los 5s
    const hideTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    // Cerrar con tecla ESC
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [achievement]); // cada nuevo logro vuelve a ejecutar el ciclo

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, 300); // debe coincidir con la duración de la animación de salida
  };

  if (!achievement || !isVisible) return null;

  return (
    <div
      className={`achievement-notification ${isAnimating ? 'animate-in' : 'animate-out'}`}
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
      aria-label="Logro desbloqueado"
    >
      <div
        className="achievement-notification-content"
        style={{ borderLeftColor: color }}
        onClick={(e) => e.stopPropagation()}
      >
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
              title="Cerrar"
            >
              <FaTimes />
            </button>
          </div>

          <div className="achievement-details">
            <h4 className="achievement-name" style={{ color }}>
              {achievement?.name ?? 'Nuevo logro'}
            </h4>

            {achievement?.description && (
              <p className="achievement-description">{achievement.description}</p>
            )}

            <div className="achievement-reward">
              {Number.isFinite(achievement?.points) && (
                <span className="achievement-points">+{achievement.points} puntos</span>
              )}
              {achievement?.reward?.value && (
                <span className="achievement-badge">{achievement.reward.value}</span>
              )}
            </div>
          </div>
        </div>

        {/* Celebración / Confetti */}
        <div className="achievement-celebration" aria-hidden>
          <div className="confetti confetti-1"></div>
          <div className="confetti confetti-2"></div>
          <div className="confetti confetti-3"></div>
          <div className="confetti confetti-4"></div>
          <div className="confetti confetti-5"></div>
        </div>
      </div>

      {/* Cerrar si el usuario hace click fuera del popup */}
      <button className="achievement-overlay-dismiss" onClick={handleClose} aria-label="Cerrar"></button>
    </div>
  );
};

export default AchievementNotification;
