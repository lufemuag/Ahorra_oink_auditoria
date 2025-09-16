import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  FaTrophy,
  FaMedal,
  FaStar,
  FaCoins,
  FaPiggyBank,
  FaChartLine,
  FaBullseye,
  FaCheckCircle,
  FaLock,
  FaGift,
  FaCrown,
  FaRocket,
  FaGem
} from 'react-icons/fa';
import pigImage from '../../assets/CerdoLogros.png';
import './Achievements.css';

const Achievements = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAchievements();
    }
  }, [user]);

  useEffect(() => {
    // Agregar clase al body cuando se monta el componente
    document.body.classList.add('achievements-page-active');
    
    // Limpiar clase del body cuando se desmonta el componente
    return () => {
      document.body.classList.remove('achievements-page-active');
    };
  }, []);

  const loadAchievements = () => {
    try {
      // Datos de logros basados en el diseño proporcionado
      const mockAchievements = [
        {
          id: 1,
          title: "Cerdito Arriesgado",
          subtitle: "Inicia sesión en Ahorra Oink e inicia a ahorrar como un experto",
          description: "Para obtener este logro debes registrarte y realizar tu primer ahorro. ¡Es el comienzo de tu aventura financiera!",
          icon: "🐷",
          level: "Principiante",
          requirement: "Primer ahorro registrado",
          reward: "100 monedas Oink",
          unlocked: true,
          date: "2024-01-15",
          category: "Inicio"
        },
        {
          id: 2,
          title: "Ahorrador Consistente",
          subtitle: "Ahorra durante 7 días consecutivos",
          description: "Mantén tu disciplina financiera durante una semana completa. La constancia es la clave del éxito.",
          icon: "🏆",
          level: "Intermedio",
          requirement: "7 días consecutivos de ahorro",
          reward: "500 monedas Oink",
          unlocked: true,
          date: "2024-01-22",
          category: "Consistencia"
        },
        {
          id: 3,
          title: "Maestro del Presupuesto",
          subtitle: "Crea y cumple tu primer presupuesto mensual",
          description: "Domina el arte de planificar tus finanzas. Un presupuesto bien hecho es la base de la libertad financiera.",
          icon: "📊",
          level: "Avanzado",
          requirement: "Presupuesto mensual completado",
          reward: "1000 monedas Oink",
          unlocked: false,
          progress: 75,
          category: "Planificación"
        },
        {
          id: 4,
          title: "Cerdito Millonario",
          subtitle: "Ahorra tu primer millón de pesos",
          description: "¡Felicidades! Has alcanzado un hito importante en tu camino hacia la libertad financiera. ¡Sigue así!",
          icon: "💰",
          level: "Experto",
          requirement: "Ahorrar $1,000,000",
          reward: "5000 monedas Oink",
          unlocked: false,
          progress: 45,
          category: "Meta"
        },
        {
          id: 5,
          title: "Estratega Financiero",
          subtitle: "Invierte en 3 categorías diferentes",
          description: "Diversifica tu portafolio y aprende sobre diferentes tipos de inversión. La diversificación reduce el riesgo.",
          icon: "🎯",
          level: "Profesional",
          requirement: "Inversiones en 3 categorías",
          reward: "2500 monedas Oink",
          unlocked: false,
          progress: 60,
          category: "Inversión"
        },
        {
          id: 6,
          title: "Cerdito Sabio",
          subtitle: "Lee 10 artículos sobre educación financiera",
          description: "El conocimiento es poder. Mantente actualizado con las mejores prácticas financieras.",
          icon: "📚",
          level: "Sabio",
          requirement: "10 artículos leídos",
          reward: "800 monedas Oink",
          unlocked: true,
          date: "2024-01-10",
          category: "Educación"
        }
      ];
      
      setAchievements(mockAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Inicio':
        return '🚀';
      case 'Consistencia':
        return '⏰';
      case 'Planificación':
        return '📋';
      case 'Meta':
        return '🎯';
      case 'Inversión':
        return '📈';
      case 'Educación':
        return '🎓';
      default:
        return '🏆';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Principiante':
        return '#4caf50';
      case 'Intermedio':
        return '#ff9800';
      case 'Avanzado':
        return '#2196f3';
      case 'Experto':
        return '#9c27b0';
      case 'Profesional':
        return '#f44336';
      case 'Sabio':
        return '#ffeb3b';
      default:
        return '#757575';
    }
  };

  return (
    <div className="achievements-page">
      {/* Header Section */}
      <div className="achievements-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Estos son los logros que tu y Oink han obtenido, sigue así</h1>
          </div>
          <div className="header-pig">
            <div className="celebrating-pig">
              <div className="pig-body">
                <div className="pig-face">
                  <div className="pig-eyes">
                    <div className="eye left"></div>
                    <div className="eye right wink"></div>
                  </div>
                  <div className="pig-nose"></div>
                  <div className="pig-smile"></div>
                  <div className="pig-cheeks"></div>
                </div>
                <div className="pig-hat">
                  <div className="hat-decoration"></div>
                </div>
                <div className="pig-medal">
                  <div className="medal-ribbon"></div>
                  <div className="medal-badge">
                    <span>1</span>
                  </div>
                </div>
                <div className="pig-arm wave"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="achievements-grid">
        {achievements.map((achievement) => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
          >
            <div className="card-inner">
              {/* Front Face */}
              <div className="card-front">
                <div className="card-border"></div>
                <div className="card-content">
                  <div className="card-text">
                    {achievement.unlocked ? (
                      <>
                        <h3 className="achievement-title">{achievement.title}</h3>
                        <p className="achievement-subtitle">{achievement.subtitle}</p>
                        <div className="achievement-category">
                          <span className="category-icon">{getCategoryIcon(achievement.category)}</span>
                          <span className="category-text">{achievement.category}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="achievement-title">Cerdito</h3>
                        <p className="achievement-subtitle">*****</p>
                        <div className="achievement-category">
                          <span className="category-icon">?</span>
                          <span className="category-text">Desconocido</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="card-illustration">
                    <div className="pig-image-container">
                      <img 
                        src={pigImage} 
                        alt="Cerdo Oink con Medalla" 
                        className="pig-image"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Back Face */}
              <div className="card-back">
                <div className="card-border"></div>
                <div className="card-content">
                  <div className="achievement-details">
                    <div className="detail-header">
                      <h4>{achievement.title}</h4>
                      <div className={`level-badge ${achievement.level.toLowerCase()}`}>
                        {achievement.level}
                      </div>
                    </div>
                    
                    <div className="detail-description">
                      <p>{achievement.description}</p>
                    </div>

                    <div className="detail-requirement">
                      <h5>Requisito:</h5>
                      <p>{achievement.requirement}</p>
                    </div>

                    <div className="detail-reward">
                      <h5>Recompensa:</h5>
                      <p className="reward-text">{achievement.reward}</p>
                    </div>

                    {achievement.unlocked ? (
                      <div className="achievement-status unlocked">
                        <FaCheckCircle className="status-icon" />
                        <span>¡Logro Desbloqueado!</span>
                        <small>Desbloqueado el {new Date(achievement.date).toLocaleDateString('es-ES')}</small>
                        <div className="reward-info">
                          <FaCoins className="reward-icon" />
                          <span>Recompensa obtenida: {achievement.reward}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="achievement-status locked">
                        <FaLock className="status-icon" />
                        <span>Logro Bloqueado</span>
                        <div className="progress-section">
                          <div className="progress-info">
                            <span>Progreso actual:</span>
                            <span>{achievement.progress}% completado</span>
                          </div>
                          {achievement.progress && (
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${achievement.progress}%` }}
                              ></div>
                            </div>
                          )}
                          <div className="tips-section">
                            <h6>💡 Consejos para desbloquear:</h6>
                            <ul>
                              <li>Mantén la consistencia en tus ahorros</li>
                              <li>Revisa tu progreso regularmente</li>
                              <li>Sigue las recomendaciones de Oink</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;