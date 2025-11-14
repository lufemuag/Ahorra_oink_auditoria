// src/services/adminService.js
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

export const adminService = {
  // Obtener dashboard de administrador
  async getDashboard() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/dashboard/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, statistics: data.statistics };
    } catch (error) {
      console.error('Error obteniendo dashboard admin:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener lista de todos los usuarios
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, users: data.users };
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener detalles de un usuario específico
  async getUserDetail(userId) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error obteniendo detalle de usuario:', error);
      return { success: false, error: error.message };
    }
  }
};
