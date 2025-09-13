import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { achievementService } from '../../services/achievementService';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaBell, 
  FaTrophy, 
  FaMedal,
  FaStar,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaBullseye,
  FaGem,
  FaCrown,
  FaChartLine,
  FaSun,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    settings: {
      notifications: true,
      currency: 'USD',
      theme: 'light'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [achievements, setAchievements] = useState([]);
  const [achievementStats, setAchievementStats] = useState({
    total: 0,
    earned: 0,
    progress: 0,
    totalPoints: 0
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        settings: {
          notifications: user.settings?.notifications ?? true,
          currency: user.settings?.currency || 'USD',
          theme: user.settings?.theme || 'light'
        }
      });

      // Cargar logros del usuario
      loadUserAchievements();
    }
  }, [user]);

  const loadUserAchievements = () => {
    if (user) {
      const userAchievements = achievementService.getUserAchievements(user.id);
      setAchievements(userAchievements);

      const stats = achievementService.getUserAchievementStats(user.id);
      if (stats.success) {
        setAchievementStats(stats.stats);
      }
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateProfile(profileData);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al actualizar perfil' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al actualizar perfil' });
    }

    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
      setLoading(false);
      return;
    }

    try {
      const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Contraseña cambiada correctamente' });
        setShowPasswordForm(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Error al cambiar contraseña' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al cambiar contraseña' });
    }

    setLoading(false);
  };

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('settings.')) {
      const settingName = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        settings: {
          ...prev.settings,
          [settingName]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
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

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1 className="page-title">Mi Perfil</h1>
          <p className="page-subtitle">Gestiona tu información personal y configuraciones</p>
        </div>

        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            <span>{message.text}</span>
            <button onClick={clearMessage} className="alert-close">
              <FaTimes />
            </button>
          </div>
        )}

        <div className="profile-grid">
          {/* Información Personal */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaUser className="title-icon" />
                Información Personal
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-outline btn-sm"
                >
                  <FaEdit />
                  Editar
                </button>
              )}
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaUser className="label-icon" />
                    Usuario
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={profileData.username}
                    className="form-input"
                    disabled
                  />
                  <small className="form-help">El nombre de usuario no se puede cambiar</small>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FaEnvelope className="label-icon" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    disabled={!isEditing}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    <FaSave />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      clearMessage();
                    }}
                    className="btn btn-outline"
                  >
                    <FaTimes />
                    Cancelar
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Configuración de Notificaciones */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaBell className="title-icon" />
                Configuración
              </h2>
            </div>

            <div className="settings-list">
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-name">Notificaciones</span>
                  <span className="setting-description">
                    Recibir recordatorios y alertas
                  </span>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="settings.notifications"
                    checked={profileData.settings.notifications}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-name">Moneda</span>
                  <span className="setting-description">
                    Moneda preferida para mostrar cantidades
                  </span>
                </div>
                <select
                  name="settings.currency"
                  value={profileData.settings.currency}
                  onChange={handleInputChange}
                  className="setting-select"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="MXN">MXN ($)</option>
                  <option value="COP">COP ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Logros y Recompensas */}
          <div className="profile-card achievements-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaTrophy className="title-icon" />
                Logros y Recompensas
              </h2>
              <div className="achievement-stats">
                <span className="stat-item">
                  <FaCheckCircle className="stat-icon earned" />
                  {achievementStats.earned}/{achievementStats.total}
                </span>
                <span className="stat-item">
                  <FaStar className="stat-icon points" />
                  {achievementStats.totalPoints} pts
                </span>
              </div>
            </div>

            <div className="achievement-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${achievementStats.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{achievementStats.progress}% completado</span>
            </div>

            <div className="achievements-grid">
              {achievements.map(achievement => {
                const Icon = getAchievementIcon(achievement.icon);
                return (
                  <div 
                    key={achievement.id} 
                    className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}
                  >
                    <div className="achievement-icon">
                      <Icon />
                    </div>
                    <div className="achievement-info">
                      <h3 className="achievement-name">{achievement.name}</h3>
                      <p className="achievement-description">{achievement.description}</p>
                      <div className="achievement-meta">
                        <span className="achievement-points">{achievement.points} pts</span>
                        {achievement.earned ? (
                          <span className="achievement-date">
                            <FaCheckCircle className="date-icon" />
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="achievement-progress">
                            <FaClock className="progress-icon" />
                            {achievement.progress}/{achievement.requirement.value}
                          </span>
                        )}
                      </div>
                    </div>
                    {achievement.earned && (
                      <div className="achievement-badge">
                        <FaStar />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seguridad */}
          <div className="profile-card">
            <div className="card-header">
              <h2 className="card-title">
                <FaLock className="title-icon" />
                Seguridad
              </h2>
            </div>

            <div className="security-actions">
              <button 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="btn btn-outline security-btn"
              >
                <FaLock />
                Cambiar Contraseña
              </button>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label className="form-label">Contraseña Actual</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        className="form-input"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="password-toggle"
                      >
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nueva Contraseña</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className="form-input"
                        required
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="password-toggle"
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordInputChange}
                      className="form-input"
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                        clearMessage();
                      }}
                      className="btn btn-outline"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Acciones de Cuenta */}
          <div className="profile-card danger-card">
            <div className="card-header">
              <h2 className="card-title">Acciones de Cuenta</h2>
            </div>

            <div className="account-actions">
              <button 
                onClick={handleLogout}
                className="btn btn-danger logout-btn"
              >
                <FaSignOutAlt />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;