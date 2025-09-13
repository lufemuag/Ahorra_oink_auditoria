import React, { useState, useEffect } from 'react';
import { FaBell, FaCheck, FaTrash, FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';
import './NotificationsModal.css';

const NotificationsModal = ({ isOpen, onClose, onNotificationUpdate }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && user && !hasLoaded) {
      loadNotifications();
      setHasLoaded(true);
    }
  }, [isOpen, user, hasLoaded]);

  const loadNotifications = () => {
    setLoading(true);
    try {
      const userNotifications = notificationService.getByUser(user.id);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Resetear el estado para la próxima apertura
    setHasLoaded(false);
    onClose();
  };

  const handleMarkAsRead = (notificationId) => {
    const result = notificationService.markAsRead(notificationId);
    if (result.success) {
      // Actualizar inmediatamente el estado
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      // Notificar al componente padre para actualizar contador
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    }
  };

  const handleMarkAllAsRead = () => {
    const result = notificationService.markAllAsRead(user.id);
    if (result.success) {
      // Forzar actualización del estado
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      // Notificar al componente padre para actualizar contador
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    }
  };

  const handleDelete = (notificationId) => {
    const result = notificationService.delete(notificationId);
    if (result.success) {
      // Eliminar inmediatamente del estado
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      // Notificar al componente padre para actualizar contador
      if (onNotificationUpdate) {
        onNotificationUpdate();
      }
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las notificaciones?')) {
      const result = notificationService.deleteAll(user.id);
      if (result.success) {
        // Limpiar inmediatamente el estado
        setNotifications([]);
        // Notificar al componente padre para actualizar contador
        if (onNotificationUpdate) {
          onNotificationUpdate();
        }
      }
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'error':
        return <FaTimesCircle className="notification-icon error" />;
      default:
        return <FaInfoCircle className="notification-icon info" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${Math.floor(diffInHours)} horas`;
    } else if (diffInHours < 48) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString();
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <span>
          <FaBell className="modal-title-icon" />
          Notificaciones
          {unreadCount > 0 && (
            <span className="notification-count-badge">{unreadCount}</span>
          )}
        </span>
      }
      size="large"
    >
      <div className="notifications-content">
        {loading ? (
          <div className="loading-state">
            <p>Cargando notificaciones...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <FaBell className="empty-icon" />
            <h3>No hay notificaciones</h3>
            <p>Cuando tengas notificaciones importantes, aparecerán aquí.</p>
          </div>
        ) : (
          <>
            <div className="notifications-actions">
              <button
                onClick={handleMarkAllAsRead}
                className="btn btn-outline btn-sm"
                disabled={unreadCount === 0}
              >
                <FaCheck />
                Marcar todas como leídas
              </button>
              <button
                onClick={handleDeleteAll}
                className="btn btn-outline btn-sm danger"
              >
                <FaTrash />
                Eliminar todas
              </button>
            </div>

            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? 'read' : 'unread'} ${notification.priority}`}
                >
                  <div className="notification-content">
                    <div className="notification-header">
                      {getNotificationIcon(notification.type)}
                      <div className="notification-title-section">
                        <h4 className="notification-title">{notification.title}</h4>
                        <span className="notification-time">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <div className="notification-actions">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="btn-icon"
                            title="Marcar como leída"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="btn-icon danger"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="notification-message">{notification.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default NotificationsModal;
