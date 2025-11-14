// src/services/savingsMethodService.js
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

export const savingsMethodService = {
  // Obtener el método de ahorro actual del usuario
  async getCurrentMethod() {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me/savings-method/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error obteniendo método de ahorro:', error);
      return { success: false, error: error.message };
    }
  },

  // Actualizar el método de ahorro del usuario
  async updateMethod(method, monthlyIncome) {
    try {
      const response = await fetch(`${API_BASE}/api/auth/me/savings-method/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          method: method,
          monthly_income: monthlyIncome
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { 
          success: false, 
          error: data.error || 'Error al actualizar el método de ahorro',
          days_remaining: data.days_remaining || 0,
          can_change: data.can_change !== undefined ? data.can_change : true
        };
      }
      
      return { success: true, data: data.data || data };
    } catch (error) {
      console.error('Error actualizando método de ahorro:', error);
      return { success: false, error: error.message };
    }
  }
};
