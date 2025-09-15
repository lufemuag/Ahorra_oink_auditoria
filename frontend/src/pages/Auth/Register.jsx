import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaEye, 
  FaEyeSlash, 
  FaCoins, 
  FaUser, 
  FaUserTag, 
  FaLock 
} from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, loading, error, clearError, isAuthenticated } = useAuth();
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Solo se permiten letras, números y guiones bajos';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'La contraseña debe contener al menos una mayúscula y una minúscula';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim().toLowerCase(),
        password: formData.password
      });
      
      if (result.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Register error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !isSubmitting) {
    return (
      <div className="auth-container">
        <div className="main-container">
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
          {/* Sección izquierda - Ilustración del cerdo */}
          <div className="character-section">
            <div className="pig-character">
              <div className="pig-body">
                <div className="pig-head">
                  <div className="pig-hat"></div>
                  <div className="pig-ear left"></div>
                  <div className="pig-ear right"></div>
                  <div className="pig-eyes">
                    <div className="pig-eye left"></div>
                    <div className="pig-eye right"></div>
                  </div>
                  <div className="pig-glasses"></div>
                  <div className="pig-snout"></div>
                </div>
                <div className="pig-arm left"></div>
                <div className="pig-arm right"></div>
                <div className="pig-leg left"></div>
                <div className="pig-leg right"></div>
              </div>
            </div>
          </div>

          {/* Sección derecha - Formulario */}
          <div className="login-section">
            <h2 className="login-title">Crea tu cuenta</h2>
            <p className="login-subtitle">para iniciar a ahorrar con Oink</p>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Nombre"
                  autoComplete="given-name"
                />
                {errors.firstName && <span className="form-error">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="username">Correo</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Correo"
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
                  placeholder="Contraseña"
                  autoComplete="new-password"
                />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="checkbox-input"
                  />
                  <label htmlFor="acceptTerms" className="checkbox-label">
                    Acepto los <Link to="/terms-and-conditions" className="terms-link">términos y condiciones</Link>
                  </label>
                </div>
                {errors.acceptTerms && <span className="form-error">{errors.acceptTerms}</span>}
              </div>

              <button 
                type="submit" 
                className="login-button"
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? (
                  <>
                    <div className="loader small"></div>
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </button>
            </form>

            <div className="register-link">
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;