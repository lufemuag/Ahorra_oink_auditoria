import React, { useState } from 'react';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaUserTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { adminUserService } from '../../services/adminUserService';
import Modal from '../common/Modal';
import './CreateUserModal.css';

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.firstName.trim()) {
      setError('El nombre es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.lastName.trim()) {
      setError('El apellido es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError('La contraseña es obligatoria');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      setError('El formato del email no es válido');
      setLoading(false);
      return;
    }

    try {
      const result = adminUserService.createUser({
        username: formData.username.trim(),
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        // Resetear formulario
        setFormData({
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          password: '',
          confirmPassword: '',
          role: 'user'
        });
        
        onSuccess && onSuccess(result.user);
        onClose();
      } else {
        setError(result.error || 'Error al crear el usuario');
      }
    } catch (error) {
      setError('Error inesperado al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span>
          <FaUserPlus className="modal-title-icon" />
          Crear Nuevo Usuario
        </span>
      }
      size="large"
    >
      <div className="create-user-form">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
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
                onChange={handleInputChange}
                className="form-input"
                placeholder="usuario123"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <FaEnvelope className="label-icon" />
                Email (Opcional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="usuario@ejemplo.com"
              />
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
                onChange={handleInputChange}
                className="form-input"
                placeholder="Juan"
                required
              />
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
                onChange={handleInputChange}
                className="form-input"
                placeholder="Pérez"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <FaLock className="label-icon" />
                Contraseña *
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                <FaLock className="label-icon" />
                Confirmar Contraseña *
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Repetir contraseña"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateUserModal;





