// src/pages/Achievements/Achievements.jsx
import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAchievements } from '../../context/AchievementsContext';

import pigHero from '../../assets/CerdoLogros.png';
import pigHead from '../../assets/cabeza.png';

import './Achievements.css';

const Achievements = () => {
  const { user } = useAuth();
  const { achievements = [] } = useAchievements() || { achievements: [] };

  useEffect(() => {
    document.body.classList.add('achievements-page-active');
    return () => document.body.classList.remove('achievements-page-active');
  }, []);

  return (
    <div className="achievements-page">
      {/* HEADER */}
      <div className="achievements-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Estos son los logros que tú y Oink han obtenido, ¡sigue así!</h1>
          </div>
          <div className="header-pig-image">
            <img src={pigHero} alt="Cerdo Oink" className="header-pig-img" />
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="achievements-grid">
        {achievements.map((a, idx) => {
          const alignClass = idx % 2 === 0 ? 'align-left' : 'align-right';
          const cardState  = a.unlocked ? 'unlocked' : 'locked';

          const title       = a.title || a.name || 'Logro';
          const subtitle    = a.subtitle || '';
          const details     = a.details || a.description || 'Más info del logro aparecerá aquí.';
          const date        = a.date;
          const isUnlocked  = !!a.unlocked;

          return (
            <div key={a.id} className={`achievement-card ${alignClass} ${cardState}`}>
              <div className="card-frame flip-card">
                <div className="flip-inner">
                  {/* FRONT */}
                  <div className={`flip-face flip-front ${alignClass}`}>
                    <div className="card-content">
                      <div className="card-illustration">
                        {isUnlocked ? (
                          <div className="unlocked-box">
                            <img src={pigHead} alt="Cabeza cerdito" className="pig-image" />
                          </div>
                        ) : (
                          <div className="locked-box" aria-hidden>
                            <span>?</span>
                          </div>
                        )}
                      </div>

                      <div className="card-text">
                        {isUnlocked ? (
                          <>
                            <h3 className="achievement-title">{title}</h3>
                            {subtitle && <p className="achievement-subtitle">{subtitle}</p>}
                          </>
                        ) : (
                          <>
                            <h3 className="achievement-title">Cerdito</h3>
                            <div className="mask-line" />
                            <p className="achievement-subtitle"></p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className={`flip-face flip-back ${alignClass}`}>
                    <div className="card-content back-content">
                      <div className="card-text">
                        <h3 className="achievement-title">
                          {isUnlocked ? title : 'Logro bloqueado'}
                        </h3>
                        <p className="achievement-details">{details}</p>
                        {date && isUnlocked && <p className="ach-date">Obtenido el: {new Date(date).toLocaleString()}</p>}
                        {!isUnlocked && (
                          <p className="hint">Consejo: completa los pasos indicados para desbloquearlo.</p>
                        )}
                      </div>

                      <div className="card-illustration">
                        {isUnlocked ? (
                          <div className="unlocked-box">
                            <img src={pigHead} alt="Cabeza cerdito" className="pig-image" />
                          </div>
                        ) : (
                          <div className="locked-box"><span>?</span></div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}

        {achievements.length === 0 && (
          <div className="achievement-empty">No hay logros configurados todavía.</div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
