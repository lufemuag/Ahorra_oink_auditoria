import React, { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle, FaUser, FaTrash } from 'react-icons/fa';
import { adminUserService } from '../../services/adminUserService';
import './DeleteUserModal.css';

const DeleteUserModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && userId) {
      loadUserData();
    }
  }, [isOpen, userId]);

  const loadUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const result = adminUserService.getUserById(userId);
      if (result.success) {
        setUserData(result.user);
      } else {
        setError('No se pudo cargar la información del usuario');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Error al cargar la información del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      const result = adminUserService.deleteUser(userId);
      
      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.error || 'Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error al eliminar el usuario');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setUserData(null);
    setError('');
    setIsDeleting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="modal-container small delete-user-modal">
        <div className="modal-header">
          <h2 className="modal-title">Eliminar Usuario</h2>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Cerrar modal"
            disabled={isDeleting}
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-content">
          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Cargando información del usuario...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">
                <FaExclamationTriangle />
              </div>
              <h3>Error</h3>
              <p>{error}</p>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : userData ? (
            <div className="delete-confirmation">
              <div className="warning-icon">
                <FaExclamationTriangle />
              </div>
              
              <h3>¿Estás seguro?</h3>
              <p className="warning-text">
                Esta acción no se puede deshacer. Se eliminará permanentemente:
              </p>
              
              <div className="user-info">
                <div className="user-avatar">
                  <FaUser />
                </div>
                <div className="user-details">
                  <h4>{userData.firstName} {userData.lastName}</h4>
                  <p>@{userData.username}</p>
                  <p className="user-role">
                    <span className={`role-badge ${userData.role}`}>
                      {userData.role === 'admin' ? 'Administrador' : 'Usuario'}
                    </span>
                  </p>
                  <p className="user-stats">
                    Ahorros: ${(userData.stats?.totalSavings || 0).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="consequences">
                <h4>Se eliminará:</h4>
                <ul>
                  <li>✓ Cuenta del usuario</li>
                  <li>✓ Datos personales</li>
                  <li>✓ Historial de transacciones</li>
                  <li>✓ Metas de ahorro</li>
                  <li>✓ Logros y estadísticas</li>
                </ul>
              </div>
              
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                  disabled={isDeleting}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <div className="loader small"></div>
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Eliminar Usuario
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;


