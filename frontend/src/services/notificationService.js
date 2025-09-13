import { generateUniqueId } from '../utils/idGenerator';

const NOTIFICATIONS_KEY = 'ahorra_oink_notifications';

export const notificationService = {
  // Crear nueva notificación
  create: (notificationData) => {
    try {
      const notifications = getNotifications();
      const newNotification = {
        id: generateUniqueId(),
        userId: notificationData.userId,
        type: notificationData.type, // 'info', 'success', 'warning', 'error'
        title: notificationData.title,
        message: notificationData.message,
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: notificationData.actionUrl || null,
        priority: notificationData.priority || 'normal' // 'low', 'normal', 'high'
      };
      
      notifications.unshift(newNotification); // Agregar al inicio
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      
      return { success: true, notification: newNotification };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error: 'Error al crear la notificación' };
    }
  },

  // Obtener notificaciones del usuario
  getByUser: (userId) => {
    try {
      const notifications = getNotifications();
      return notifications.filter(n => n.userId === userId);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Obtener notificaciones no leídas
  getUnread: (userId) => {
    try {
      const notifications = getNotifications();
      return notifications.filter(n => n.userId === userId && !n.isRead);
    } catch (error) {
      console.error('Error getting unread notifications:', error);
      return [];
    }
  },

  // Marcar notificación como leída
  markAsRead: (notificationId) => {
    try {
      const notifications = getNotifications();
      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      
      if (notificationIndex !== -1) {
        notifications[notificationIndex].isRead = true;
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
        return { success: true };
      }
      
      return { success: false, error: 'Notificación no encontrada' };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error: 'Error al marcar como leída' };
    }
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead: (userId) => {
    try {
      const notifications = getNotifications();
      const updatedNotifications = notifications.map(n => 
        n.userId === userId ? { ...n, isRead: true } : n
      );
      
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error: 'Error al marcar todas como leídas' };
    }
  },

  // Eliminar notificación
  delete: (notificationId) => {
    try {
      const notifications = getNotifications();
      const filteredNotifications = notifications.filter(n => n.id !== notificationId);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications));
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error: 'Error al eliminar la notificación' };
    }
  },

  // Eliminar todas las notificaciones del usuario
  deleteAll: (userId) => {
    try {
      const notifications = getNotifications();
      const filteredNotifications = notifications.filter(n => n.userId !== userId);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filteredNotifications));
      return { success: true };
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      return { success: false, error: 'Error al eliminar todas las notificaciones' };
    }
  },

  // Crear notificaciones automáticas
  createAutomaticNotifications: (userId) => {
    const notifications = [];
    
    // Notificación de bienvenida
    notifications.push({
      userId,
      type: 'info',
      title: '¡Bienvenido a Ahorra Oink! 🐷',
      message: 'Comienza registrando tus primeros ingresos y gastos para tener un control completo de tus finanzas.',
      priority: 'high'
    });

    // Notificación de consejo
    notifications.push({
      userId,
      type: 'info',
      title: '💡 Consejo de Ahorro',
      message: 'Establece una meta de ahorro para motivarte y alcanzar tus objetivos financieros.',
      priority: 'normal'
    });

    // Notificación de recordatorio
    notifications.push({
      userId,
      type: 'warning',
      title: '📊 Registra tus Gastos',
      message: 'No olvides registrar tus gastos diarios para mantener un control preciso de tu presupuesto.',
      priority: 'normal'
    });

    // Crear todas las notificaciones
    notifications.forEach(notification => {
      notificationService.create(notification);
    });

    return { success: true, count: notifications.length };
  }
};

// Funciones auxiliares
function getNotifications() {
  try {
    const notifications = localStorage.getItem(NOTIFICATIONS_KEY);
    return notifications ? JSON.parse(notifications) : [];
  } catch (error) {
    console.error('Error parsing notifications data:', error);
    return [];
  }
}

