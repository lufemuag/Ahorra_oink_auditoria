import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaPiggyBank, FaLock, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { passwordResetService } from '../../services/passwordResetService';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: form, 2: success, 3: error
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError('Token de restablecimiento no válido');
      setStep(3);
      return;
    }

    // Verificar si el token es válido
    const result = passwordResetService.verifyResetToken(token);
    if (result.success) {
      setTokenValid(true);
    } else {
      setTokenError(result.error);
      setStep(3);
    }
  }, [token]);

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

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
      const result = passwordResetService.resetPassword(token, formData.password);
      
      if (result.success) {
        setStep(2); // Éxito
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setErrors({ general: 'Error al restablecer la contraseña' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (step === 2) {
    return (
      <div className="auth-container">
        <div className="auth-card animate-fade-in">
          <div className="auth-header">
            <div className="auth-logo">
              <FaPiggyBank className="logo-icon animate-bounce" />
              <h1>Ahorra Oink</h1>
            </div>
            <h2>¡Contraseña Restablecida!</h2>
            <p>Tu contraseña ha sido actualizada exitosamente.</p>
          </div>

          <div className="success-message">
            <div className="success-icon">
              <FaCheck />
            </div>
            <p>Ahora puedes iniciar sesión con tu nueva contraseña.</p>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={handleBackToLogin}
          >
            Ir al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="auth-container">
        <div className="auth-card animate-fade-in">
          <div className="auth-header">
            <div className="auth-logo">
              <FaPiggyBank className="logo-icon animate-bounce" />
              <h1>Ahorra Oink</h1>
            </div>
            <h2>Error</h2>
            <p>No se pudo procesar la solicitud.</p>
          </div>

          <div className="error-message">
            <div className="error-icon">
              <FaExclamationTriangle />
            </div>
            <p>{tokenError || 'Token inválido o expirado'}</p>
          </div>

          <button 
            className="btn btn-primary btn-lg"
            onClick={handleBackToLogin}
          >
            Volver al Inicio de Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loader"></div>
          <p>Verificando token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <FaPiggyBank className="logo-icon animate-bounce" />
            <h1>Ahorra Oink</h1>
          </div>
          <h2>Restablecer Contraseña</h2>
          <p>Ingresa tu nueva contraseña.</p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="error-message animate-slide-in">
            <p>{errors.general}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              <FaLock className="label-icon" />
              Nueva Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Tu nueva contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              <FaLock className="label-icon" />
              Confirmar Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirma tu nueva contraseña"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="loader small"></div>
                Restableciendo...
              </>
            ) : (
              'Restablecer Contraseña'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            ¿Recordaste tu contraseña?{' '}
            <button 
              className="auth-link"
              onClick={handleBackToLogin}
            >
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;






