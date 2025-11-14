// src/pages/Auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import pigImage from '../../assets/cabeza.png';
import './Auth.css';
import { triggerAchievementsRefresh } from '../../utils/achievements'; // 🏆 añadido

const Login = () => {
  // 🔧 Dominios permitidos para el login
  const ALLOWED_DOMAINS = ['pascualbravo.edu.co', 'test.com'];

  // Utilidad para limpiar el dominio si el usuario lo escribe completo
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const domainRegexes = ALLOWED_DOMAINS.map(domain => new RegExp('@' + escapeRegex(domain) + '$', 'i'));

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => clearError(), 5000);
    return () => clearTimeout(t);
  }, [error]); 

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      let cleanValue = value;
      for (const regex of domainRegexes) {
        cleanValue = cleanValue.replace(regex, '');
      }
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
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
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setIsSubmitting(true);
    try {
      let email = formData.username.trim().toLowerCase();

      if (email.includes('@')) {
        const isValidDomain = ALLOWED_DOMAINS.some(domain => email.endsWith(`@${domain}`));
        if (!isValidDomain) {
          setErrors({ username: `Debe usar un email de ${ALLOWED_DOMAINS.map(d => `@${d}`).join(' o ')}` });
          setIsSubmitting(false);
          return;
        }
      } else {
        // Si solo ingresó el nombre de usuario, agregar el primer dominio por defecto
        email = `${email}@${ALLOWED_DOMAINS[0]}`;
      }

      const result = await login(email, formData.password);

      if (result?.success) {
        // 🏆 Refresca/Notifica logros al iniciar sesión (ya hay token)
        try { triggerAchievementsRefresh(); } catch {}

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
        <div className="main-container">
          <div className="register-card" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div className="loader" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="main-container">
        <div className="register-card">
          {/* Panel izquierdo: imagen con flotado */}
          <div className="register-left">
            <img src={pigImage} alt="Cerdo Oink" className="pig-image--mock" />
          </div>

          {/* Panel derecho: formulario */}
          <div className="register-right">
            <h2 className="login-title strong">Iniciar sesión</h2>
            <p className="login-subtitle">Oink te espera para seguir ahorrando</p>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Usuario con dominio fijo (mismo estilo que Register) */}
              <div className="form-group">
                <label className="form-label" htmlFor="username">Correo</label>
                <div className={`email-wrapper ${errors.username ? 'error' : ''}`}>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete="username"
                  />
                  <span className="email-domain">@{ALLOWED_DOMAINS[0]}</span>
                </div>
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              {/* Contraseña (wrapper unificado) */}
              <div className="form-group">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input with-toggle"
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Link a reset password */}
                <button
                  type="button"
                  onClick={() => navigate('/reset-password')}
                  className="terms-link"
                  style={{ background: 'transparent', border: 'none', padding: 0, marginTop: 6, cursor: 'pointer' }}
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
                    <div className="loader small" />
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
        </div>
      </div>
    </div>
  );
};

export default Login;
