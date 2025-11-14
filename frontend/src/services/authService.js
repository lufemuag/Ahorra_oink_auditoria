// src/services/authService.js
import { encryptCredentials } from "../utils/encryption.js";
import { temporaryMethodService } from "./temporaryMethodService.js";
import { savingsMethodService } from "./savingsMethodService.js";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const LS_AUTH = "ahorra_oink_auth";

// === Helpers de sesión ===
function getSession() {
  const raw = localStorage.getItem(LS_AUTH);
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function setSession(next) {
  localStorage.setItem(LS_AUTH, JSON.stringify(next));
}
function clearSession() {
  localStorage.removeItem(LS_AUTH);
}
function getToken() {
  return getSession()?.token || null;
}
function authHeaders(extra = {}) {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra }
    : { "Content-Type": "application/json", ...extra };
}

export const authService = {
  initializeDefaultAdmin() {},

  isAuthenticated() {
    return !!getSession()?.token;
  },

  async getCurrentUser() {
    const token = getToken();
    if (!token) return null;
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      
      if (!res.ok) {
        // Si es 401, el token es inválido
        if (res.status === 401) {
          console.log('Token inválido, limpiando sesión');
          clearSession();
        }
        return null;
      }

      const user = {
        id: data.id,
        nombre: data.nombrecompleto,
        correo: data.correo,
      };

      const session = getSession() || {};
      setSession({ ...session, user });
      return user;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  logout() {
    clearSession();
    return { success: true };
  },

  async register(payload) {
    try {
      const res = await fetch(`${API_BASE}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        console.log('Registro exitoso, datos recibidos:', data);
        
        // Guardar la sesión con el token
        const { token, refresh, user } = data;
        if (token && user) {
          setSession({ token, refresh, user });
          console.log('Sesión guardada después del registro');
        }
        
        // Aplicar valor guardado en localStorage si existe
        console.log('Llamando applyStoredDashboardValue...');
        await this.applyStoredDashboardValue(data.user);
        
        return { success: true, user: data.user };
      }

      // ⚠️ Propagamos errores por campo (para pintar debajo de inputs)
      const fieldErrors = data?.errors;
      const msg = fieldErrors
        ? Object.values(fieldErrors).flat().join(" ")
        : data?.detail || data?.error || `Error ${res.status}`;

      return { success: false, error: msg, errors: fieldErrors };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor" };
    }
  },

  async login(username, password) {
    try {
      // Encriptar credenciales antes del envío
      const encryptedCredentials = encryptCredentials(username, password);
      
      if (!encryptedCredentials) {
        return { success: false, error: "Error al encriptar credenciales" };
      }
      
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encryptedCredentials),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        const msg = data?.errors
          ? Object.values(data.errors).flat().join(" ")
          : data?.detail || data?.error || "Credenciales inválidas";
        return { success: false, error: msg };
      }

      const { token, refresh, user } = data;
      if (!token || !user) return { success: false, error: "Respuesta inválida del servidor" };

      setSession({ token, refresh, user });
      
      // Aplicar valor del dashboard y metodología temporal si existen
      await this.applyStoredDashboardValue(user);
      
      return { success: true, user };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor" };
    }
  },

  async updateMe(payload) {
    const res = await fetch(`${API_BASE}/api/auth/me/detail/`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const msg = data?.errors
        ? Object.values(data.errors).flat().join(" ")
        : data?.detail || "No se pudo actualizar el perfil";
      return { success: false, error: msg };
    }

    const session = getSession() || {};
    setSession({ ...session, user: data.user });
    return { success: true, user: data.user };
  },

  async deleteMe() {
    const token = getToken();
    if (!token) return { success: false, error: "No autenticado" };

    const res = await fetch(`${API_BASE}/api/auth/me/detail/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const msg = data?.detail || "No se pudo eliminar la cuenta";
      return { success: false, error: msg };
    }

    clearSession();
    return { success: true };
  },

  async changePassword(current_password, new_password) {
    const res = await fetch(`${API_BASE}/api/auth/me/change-password/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ current_password, new_password }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const msg = data?.errors
        ? (typeof data.errors === "string" ? data.errors : Object.entries(data.errors).map(([k,v]) => Array.isArray(v)? v.join(" "): String(v)).join(" "))
        : data?.detail || "No se pudo cambiar la contraseña";
      return { success: false, error: msg };
    }

    return { success: true };
  },

  async deleteAccount(password, reason = '') {
    const res = await fetch(`${API_BASE}/api/auth/me/delete-account/`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ password, reason }),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      const msg = data?.error || data?.detail || "No se pudo eliminar la cuenta";
      return { success: false, error: msg };
    }

    clearSession();
    return { success: true, message: data.message };
  },

  // Aplicar metodología temporal al usuario autenticado
  async applyTemporaryMethod() {
    try {
      // Verificar si hay método temporal válido
      if (!temporaryMethodService.hasValidTemporaryMethod()) {
        console.log('No hay método temporal válido para aplicar');
        return;
      }

      // Obtener método temporal
      const tempResult = temporaryMethodService.getTemporaryMethod();
      if (!tempResult.success || !tempResult.data) {
        console.log('No se pudo obtener método temporal');
        return;
      }

      const { method, monthly_income } = tempResult.data;
      
      // Aplicar método al usuario autenticado
      const result = await savingsMethodService.updateMethod(method, monthly_income);
      
      if (result.success) {
        console.log('Método temporal aplicado correctamente:', result.data);
        // Limpiar método temporal después de aplicarlo
        temporaryMethodService.clearTemporaryMethod();
        
        // Actualizar el balance en el contexto de dinero
        if (window.refreshMoneyContext) {
          window.refreshMoneyContext();
        }
      } else {
        console.error('Error aplicando método temporal:', result.error);
      }
    } catch (error) {
      console.error('Error en applyTemporaryMethod:', error);
    }
  },

  async applyStoredDashboardValue(user) {
    try {
      console.log('=== APLICANDO VALOR DEL DASHBOARD ===');
      console.log('Usuario recibido:', user);
      
      // Verificar si hay un valor guardado en localStorage del dashboard público
      const storedAmount = localStorage.getItem('userTotalAmount');
      const amountSet = localStorage.getItem('userAmountSet');
      
      console.log('Valores en localStorage:', {
        storedAmount,
        amountSet,
        allLocalStorage: Object.keys(localStorage).reduce((acc, key) => {
          acc[key] = localStorage.getItem(key);
          return acc;
        }, {})
      });
      
      if (storedAmount && amountSet === 'true') {
        console.log('Aplicando valor del dashboard público:', storedAmount);
        
        // Aplicar el valor como balance inicial
        const amount = parseFloat(storedAmount);
        if (amount > 0) {
          console.log('Enviando request a set-initial-balance con:', {
            url: `${API_BASE}/api/auth/me/set-initial-balance/`,
            amount,
            token: user.token
          });
          
          const response = await fetch(`${API_BASE}/api/auth/me/set-initial-balance/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
          });
          
          console.log('Respuesta del servidor:', response.status, response.statusText);
          
          if (response.ok) {
            const responseData = await response.json();
            console.log('Valor del dashboard aplicado correctamente:', responseData);
            // Limpiar el valor guardado
            localStorage.removeItem('userTotalAmount');
            localStorage.removeItem('userAmountSet');
            console.log('Valores limpiados del localStorage');
            
            // Actualizar el balance en el contexto de dinero
            if (window.refreshMoneyContext) {
              window.refreshMoneyContext();
            }
          } else {
            const errorData = await response.json();
            console.error('Error aplicando valor del dashboard:', response.statusText, errorData);
          }
        } else {
          console.log('Monto inválido:', amount);
        }
      } else {
        console.log('No hay valor del dashboard para aplicar');
      }
      
      // También aplicar método temporal si existe
      console.log('Aplicando método temporal...');
      await this.applyTemporaryMethod();
      
    } catch (error) {
      console.error('Error en applyStoredDashboardValue:', error);
    }
  },

  // Aliases y stubs
  updateProfile(userData) { return this.updateMe(userData); },
  forgotPassword() { return { success: true }; },
  isAdmin() { return false; },
  getAllUsers() { return { success: true, users: [] }; },
};
