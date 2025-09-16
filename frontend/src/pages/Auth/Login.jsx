import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaPiggyBank, FaUser, FaLock, FaCoins } from 'react-icons/fa';
import ForgotPasswordModal from '../../components/auth/ForgotPasswordModal';
import pigImage from '../../assets/cabeza.png';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isSubmitting) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loader"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span className="logo-box">AHORRA</span>
          <span className="logo-box">OINK</span>
        </div>
        <div className="coins-icon">
          <FaCoins />
        </div>
      </div>

      {/* Main container */}
      <div className="main-container">
        <div className="login-wrapper">
          {/* Sección izquierda - Formulario */}
          <div className="login-section">
            <h2 className="login-title">Iniciar sesión</h2>
            <p className="login-subtitle">Oink te espera para seguir ahorrando</p>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Correo</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Tu correo o usuario"
                  autoComplete="username"
                />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
                <button 
                  type="button"
                  className="forgot-password"
                  onClick={() => setShowForgotPassword(true)}
                >
                  ¿Olvidaste tu contraseña?
                </button>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <div className="loader small"></div>
                    Iniciando...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            <div className="register-link">
              ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
            </div>
          </div>

          {/* Sección derecha - Imagen del cerdo */}
          <div className="character-section">
            <div className="pig-image-container">
              <img 
                src={pigImage} 
                alt="Cerdo Oink Sentado" 
                className="pig-image"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Olvidaste tu Contraseña */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
};

export default Login;