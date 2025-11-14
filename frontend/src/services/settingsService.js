// src/services/settingsService.js
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

export const settingsService = {
  // Obtener configuraciones del usuario
  async getSettings() {
    try {
      const response = await fetch(`${API_BASE}/api/settings/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, settings: data.settings };
    } catch (error) {
      console.error('Error obteniendo configuraciones:', error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar configuraciones del usuario
  async updateSettings(settingsData) {
    try {
      const response = await fetch(`${API_BASE}/api/settings/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(settingsData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.errors || data.detail || `Error ${response.status}` 
        };
      }
      
      return { success: true, settings: data.settings };
    } catch (error) {
      console.error('Error actualizando configuraciones:', error);
      return { success: false, error: error.message };
    }
  }
};
