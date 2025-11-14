// src/services/transactionService.js
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

export const transactionService = {
  // Obtener todas las transacciones del usuario
  async getTransactions() {
    try {
      console.log('Obteniendo transacciones desde:', `${API_BASE}/api/transactions/`);
      console.log('Headers de autenticación:', getAuthHeaders());
      
      const response = await fetch(`${API_BASE}/api/transactions/`, {
        headers: getAuthHeaders()
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos del servidor:', data);
      
      return { success: true, transactions: data.transactions || [] };
    } catch (error) {
      console.error('Error obteniendo transacciones:', error);
      return { success: false, error: error.message };
    }
  },

  // Crear nueva transacción
  async createTransaction(transactionData) {
    try {
      console.log('Creando transacción con datos:', transactionData);
      
      // Validar datos antes de enviar
      if (!transactionData.amount || transactionData.amount <= 0) {
        return { success: false, error: 'El monto debe ser mayor a 0' };
      }
      
      if (transactionData.amount > 1000000000) {
        return { success: false, error: 'El monto no puede exceder 1 billón' };
      }

      console.log('Enviando transacción al servidor:', {
        url: `${API_BASE}/api/transactions/`,
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData)
      });

      const response = await fetch(`${API_BASE}/api/transactions/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData)
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      const data = await response.json();
      console.log('Datos de respuesta:', data);
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores del servidor
        if (data.errors) {
          return { 
            success: false, 
            error: data.errors 
          };
        } else if (data.detail) {
          return { 
            success: false, 
            error: data.detail 
          };
        } else {
          return { 
            success: false, 
            error: `Error del servidor: ${response.status}` 
          };
        }
      }
      
      console.log('Transacción creada exitosamente:', data.transaction);
      return { success: true, transaction: data.transaction };
    } catch (error) {
      console.error('Error creando transacción:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, error: 'Error de conexión. Verifica tu conexión a internet.' };
      }
      return { success: false, error: error.message };
    }
  },

  // Actualizar transacción
  async updateTransaction(id, transactionData) {
    try {
      // Validar datos antes de enviar
      if (!transactionData.amount || transactionData.amount <= 0) {
        return { success: false, error: 'El monto debe ser mayor a 0' };
      }
      
      if (transactionData.amount > 1000000000) {
        return { success: false, error: 'El monto no puede exceder 1 billón' };
      }

      const response = await fetch(`${API_BASE}/api/transactions/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(transactionData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Manejar diferentes tipos de errores del servidor
        if (data.errors) {
          return { 
            success: false, 
            error: data.errors 
          };
        } else if (data.detail) {
          return { 
            success: false, 
            error: data.detail 
          };
        } else {
          return { 
            success: false, 
            error: `Error del servidor: ${response.status}` 
          };
        }
      }
      
      return { success: true, transaction: data.transaction };
    } catch (error) {
      console.error('Error actualizando transacción:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { success: false, error: 'Error de conexión. Verifica tu conexión a internet.' };
      }
      return { success: false, error: error.message };
    }
  },

  // Eliminar transacción
  async deleteTransaction(id) {
    try {
      const response = await fetch(`${API_BASE}/api/transactions/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        const data = await response.json();
        return { 
          success: false, 
          error: data.detail || `Error ${response.status}` 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error eliminando transacción:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener categorías
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE}/api/categories/`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, categories: data.categories || [] };
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      return { success: false, error: error.message };
    }
  },

  // Obtener estadísticas
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE}/api/statistics/`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return { success: true, statistics: data.statistics };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return { success: false, error: error.message };
    }
  }
};