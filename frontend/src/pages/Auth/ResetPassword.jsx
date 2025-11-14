import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { passwordResetService } from '../../services/passwordResetService';
import pigImage from '../../assets/cabeza.png';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1=form | 2=success | 3=error
  const [step, setStep] = useState(1);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenError('Token de restablecimiento no válido');
      setStep(3);
      return;
    }
    const result = passwordResetService.verifyResetToken(token);
    if (result.success) setTokenValid(true);
    else {
      setTokenError(result.error || 'Token inválido o expirado');
      setStep(3);
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    else if (formData.password.length < 6)
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirma tu contraseña';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';

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
      const result = passwordResetService.resetPassword(token, formData.password);
      if (result.success) setStep(2);
      else setErrors({ general: result.error || 'No se pudo restablecer la contraseña' });
    } catch (err) {
      setErrors({ general: 'Error al restablecer la contraseña' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goLogin = () => navigate('/login');

  // Verificación de token (loading) manteniendo layout
  if (!tokenValid && step === 1) {
    return (
      <div className="auth-container">
        <div className="main-container">
          <div className="register-card">
            <div className="register-left">
              <img src={pigImage} alt="Cerdo Oink" className="pig-image--mock" />
            </div>
            <div className="register-right">
              <h2 className="login-title strong">Verificando enlace…</h2>
              <p className="login-subtitle">Un momento por favor.</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <div className="loader" />
                <span>Verificando token…</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Éxito
  if (step === 2) {
    return (
      <div className="auth-container">
        <div className="main-container">
          <div className="register-card">
            <div className="register-left">
              <img src={pigImage} alt="Cerdo Oink" className="pig-image--mock" />
            </div>
            <div className="register-right">
              <h2 className="login-title strong">¡Contraseña restablecida!</h2>
              <p className="login-subtitle">Tu contraseña fue actualizada correctamente.</p>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20, color: '#2b704e', display: 'inline-flex' }}><FaCheck /></span>
                <span>Ahora puedes iniciar sesión con tu nueva contraseña.</span>
              </div>

              <button className="login-button" onClick={goLogin}>
                Ir al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error
  if (step === 3) {
    return (
      <div className="auth-container">
        <div className="main-container">
          <div className="register-card">
            <div className="register-left">
              <img src={pigImage} alt="Cerdo Oink" className="pig-image--mock" />
            </div>
            <div className="register-right">
              <h2 className="login-title strong">Hubo un problema</h2>
              <p className="login-subtitle">No se pudo procesar tu solicitud.</p>

              <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}><FaExclamationTriangle /></span>
                <span>{tokenError}</span>
              </div>

              <button className="login-button" onClick={goLogin}>
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario
  return (
    <div className="auth-container">
      <div className="main-container">
        <div className="register-card">
          {/* Panel izquierdo: cerdito flotando */}
          <div className="register-left">
            <img src={pigImage} alt="Cerdo Oink" className="pig-image--mock" />
          </div>

          {/* Panel derecho: formulario en “papel” */}
          <div className="register-right">
            <h2 className="login-title strong">Restablecer contraseña</h2>
            <p className="login-subtitle">Ingresa tu nueva contraseña.</p>

            {errors.general && (
              <div className="error-message">
                <p style={{ margin: 0 }}>{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Nueva contraseña */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Nueva contraseña</label>
                <div className={`password-wrapper ${errors.password ? 'error' : ''}`}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Tu nueva contraseña"
                    autoComplete="new-password"
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
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              {/* Confirmar contraseña */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                <div className={`password-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirma tu nueva contraseña"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-visibility"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button type="submit" className="login-button" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="loader small" />
                    Restableciendo...
                  </>
                ) : (
                  'Restablecer contraseña'
                )}
              </button>
            </form>

            <div className="register-link">
              ¿Recordaste tu contraseña?{' '}
              <button
                onClick={goLogin}
                className="terms-link"
                style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
