import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { passwordResetService } from '../../services/passwordResetService';
import './ForgotPasswordModal.css';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: email, 2: success, 3: error
  const [formData, setFormData] = useState({
    email: '',
    username: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
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
      // Usar el servicio de restablecimiento de contraseña
      const result = passwordResetService.requestPasswordReset(
        formData.email, 
        formData.username
      );

      if (result.success) {
        setStep(2); // Éxito
      } else {
        setStep(3); // Error
      }
    } catch (error) {
      console.error('Error sending reset request:', error);
      setStep(3); // Error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({ email: '', username: '' });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleBackToLogin = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-container medium">
        <div className="modal-header">
          <h2 className="modal-title">
            {step === 1 && 'Restablecer Contraseña'}
            {step === 2 && 'Solicitud Enviada'}
            {step === 3 && 'Error'}
          </h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          {step === 1 && (
            <div className="forgot-password-step">
              <div className="step-icon">
                <FaEnvelope />
              </div>
              <p className="step-description">
                Ingresa tu correo electrónico y nombre de usuario para recibir instrucciones 
                sobre cómo restablecer tu contraseña.
              </p>
              
              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="tu@email.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-input ${errors.username ? 'error' : ''}`}
                    placeholder="Tu nombre de usuario"
                    autoComplete="username"
                  />
                  {errors.username && <span className="form-error">{errors.username}</span>}
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loader small"></div>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Solicitud'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="forgot-password-step success">
              <div className="step-icon success">
                <FaCheck />
              </div>
              <h3>¡Solicitud Enviada!</h3>
              <p className="step-description">
                Hemos enviado las instrucciones para restablecer tu contraseña a:
              </p>
              <p className="email-sent">{formData.email}</p>
              <p className="step-description">
                Revisa tu bandeja de entrada y sigue las instrucciones. 
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBackToLogin}
                >
                  Volver al Inicio de Sesión
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="forgot-password-step error">
              <div className="step-icon error">
                <FaExclamationTriangle />
              </div>
              <h3>Error al Enviar Solicitud</h3>
              <p className="step-description">
                No pudimos encontrar una cuenta con los datos proporcionados. 
                Verifica que el correo electrónico y nombre de usuario sean correctos.
              </p>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setStep(1)}
                >
                  Intentar de Nuevo
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBackToLogin}
                >
                  Volver al Inicio de Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
