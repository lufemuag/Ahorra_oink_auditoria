import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { recoveryService } from '../../services/recoveryService';
import { FaTrashRestore, FaTrash, FaExclamationTriangle, FaClock, FaUser } from 'react-icons/fa';
import './UserRecovery.css';

const UserRecovery = () => {
  const { user } = useAuth();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadDeletedUsers();
    }
  }, [user]);

  const loadDeletedUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await recoveryService.getDeletedUsers();
      if (result.success) {
        setDeletedUsers(result.deletedUsers);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar usuarios eliminados');
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreUser = async (userId) => {
    try {
      const result = await recoveryService.restoreUser(userId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadDeletedUsers(); // Recargar lista
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al restaurar usuario' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleSoftDeleteUser = async (userId, reason) => {
    try {
      const result = await recoveryService.softDeleteUser(userId, reason);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadDeletedUsers(); // Recargar lista
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al eliminar usuario' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handlePermanentDeleteUser = async (userId) => {
    try {
      const result = await recoveryService.permanentDeleteUser(userId);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        loadDeletedUsers(); // Recargar lista
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: result.error });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al eliminar usuario permanentemente' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || user.correo !== 'admin@pascualbravo.edu.co') {
    return (
      <div className="user-recovery">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos de administrador para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="user-recovery">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando usuarios eliminados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-recovery">
      <div className="recovery-header">
        <h1>Recuperación de Cuentas</h1>
        <p>Gestiona usuarios eliminados y restaura cuentas cuando sea necesario</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="recovery-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FaTrash />
          </div>
          <div className="stat-content">
            <h3>{deletedUsers.length}</h3>
            <p>Usuarios Eliminados</p>
          </div>
        </div>
      </div>

      <div className="deleted-users-section">
        <h2>Usuarios Eliminados</h2>
        
        {deletedUsers.length === 0 ? (
          <div className="no-users">
            <FaUser />
            <p>No hay usuarios eliminados</p>
          </div>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Eliminado</th>
                  <th>Días</th>
                  <th>Eliminado por</th>
                  <th>Razón</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {deletedUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="user-info">
                        <FaUser />
                        <span>{user.nombrecompleto}</span>
                      </div>
                    </td>
                    <td>{user.correo}</td>
                    <td>
                      <div className="date-info">
                        <FaClock />
                        <span>{formatDate(user.deleted_at)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`days-badge ${user.days_deleted > 30 ? 'old' : 'recent'}`}>
                        {user.days_deleted} días
                      </span>
                    </td>
                    <td>{user.deleted_by}</td>
                    <td>
                      <div className="reason">
                        {user.deletion_reason || 'Sin razón especificada'}
                      </div>
                    </td>
                    <td>
                      <div className="actions">
                        <button 
                          className="action-btn restore-btn"
                          onClick={() => handleRestoreUser(user.id)}
                          title="Restaurar usuario"
                        >
                          <FaTrashRestore />
                        </button>
                        <button 
                          className="action-btn permanent-delete-btn"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowPermanentDeleteModal(true);
                          }}
                          title="Eliminar permanentemente"
                        >
                          <FaExclamationTriangle />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminación permanente */}
      {showPermanentDeleteModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowPermanentDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Eliminación Permanente</h2>
              <button 
                className="close-btn"
                onClick={() => setShowPermanentDeleteModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="warning">
                <FaExclamationTriangle />
                <h3>¡ADVERTENCIA!</h3>
                <p>Estás a punto de eliminar <strong>permanentemente</strong> al usuario:</p>
                <div className="user-details">
                  <p><strong>Nombre:</strong> {selectedUser.nombrecompleto}</p>
                  <p><strong>Correo:</strong> {selectedUser.correo}</p>
                  <p><strong>Eliminado hace:</strong> {selectedUser.days_deleted} días</p>
                </div>
                <p className="warning-text">
                  Esta acción <strong>NO se puede deshacer</strong>. Todos los datos del usuario 
                  (transacciones, metas de ahorro, etc.) serán eliminados permanentemente.
                </p>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowPermanentDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  handlePermanentDeleteUser(selectedUser.id);
                  setShowPermanentDeleteModal(false);
                }}
              >
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRecovery;
