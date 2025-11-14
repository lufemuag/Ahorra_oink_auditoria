// src/services/recoveryService.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper para obtener headers de autenticación
function getAuthHeaders() {
  const token = localStorage.getItem('ahorra_oink_auth');
  if (token) {
    const session = JSON.parse(token);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.token}`
    };
  }
  return { 'Content-Type': 'application/json' };
}

export const recoveryService = {
  // Obtener lista de usuarios eliminados
  async getDeletedUsers() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/deleted-users/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, deletedUsers: data.deleted_users };
    } catch (error) {
      console.error('Error obteniendo usuarios eliminados:', error);
      return { success: false, error: error.message };
    }
  },

  // Restaurar usuario eliminado
  async restoreUser(userId) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/restore-user/${userId}/`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || `Error ${response.status}` 
        };
      }
      
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error('Error restaurando usuario:', error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar usuario de forma suave
  async softDeleteUser(userId, reason = 'Eliminado por administrador') {
    try {
      const response = await fetch(`${API_BASE}/api/admin/soft-delete-user/${userId}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || `Error ${response.status}` 
        };
      }
      
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return { success: false, error: error.message };
    }
  },

  // Eliminar usuario permanentemente
  async permanentDeleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/permanent-delete-user/${userId}/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ confirm: true })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || `Error ${response.status}` 
        };
      }
      
      return { success: true, message: data.message, user: data.user };
    } catch (error) {
      console.error('Error eliminando usuario permanentemente:', error);
      return { success: false, error: error.message };
    }
  }
};
