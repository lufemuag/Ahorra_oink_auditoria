import React, { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock, FaUserTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminUserService } from '../../services/adminUserService';
import './EditUserModal.css';

const EditUserModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const result = adminUserService.getUserById(userId);
      if (result.success) {
        const user = result.user;
        setFormData({
          username: user.username || '',
          email: user.email || '',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          password: '',
          confirmPassword: '',
          role: user.role || 'user'
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    // Solo validar contraseña si se proporciona
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }
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
      const updateData = {
        username: formData.username.trim(),
        email: formData.email.trim() || null,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        role: formData.role
      };

      // Solo incluir contraseña si se proporciona
      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = adminUserService.updateUser(userId, updateData);
      
      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setErrors({ general: 'Error al actualizar el usuario' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
    setErrors({});
    setIsSubmitting(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-container medium">
        <div className="modal-header">
          <h2 className="modal-title">Editar Usuario</h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Cargando datos del usuario...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="edit-user-form">
              {errors.general && (
                <div className="error-message">
                  <p>{errors.general}</p>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="username" className="form-label">
                    <FaUser className="label-icon" />
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`form-input ${errors.username ? 'error' : ''}`}
                    placeholder="Nombre de usuario"
                    required
                  />
                  {errors.username && <span className="form-error">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    <FaEnvelope className="label-icon" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="correo@ejemplo.com"
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    <FaUser className="label-icon" />
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Nombre"
                    required
                  />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    <FaUser className="label-icon" />
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Apellido"
                    required
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  <FaUserTag className="label-icon" />
                  Rol del Usuario
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="password-section">
                <h4>Cambiar Contraseña (Opcional)</h4>
                <p className="password-note">Deja en blanco si no quieres cambiar la contraseña</p>
                
                <div className="form-row">
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
                        placeholder="Nueva contraseña"
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
                        placeholder="Confirmar nueva contraseña"
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
                </div>
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
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Usuario'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;


