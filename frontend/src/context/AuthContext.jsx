// src/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, isAuthenticated: true, user: action.payload, error: null };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, isAuthenticated: false, user: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, loading: false, isAuthenticated: false, user: null, error: null };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,   // { id, nombre, correo }
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        authService.initializeDefaultAdmin?.();
        const hasToken = authService.isAuthenticated();
        
        if (hasToken) {
          const user = await authService.getCurrentUser();
          if (isMounted && user) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            return;
          } else if (isMounted) {
            // Si no se puede obtener el usuario, limpiar la sesión
            authService.logout();
          }
        }
        
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (e) {
        console.error('checkAuth error:', e);
        // En caso de error, limpiar la sesión y parar el loading
        if (isMounted) {
          authService.logout();
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const result = await authService.login(username, password);
      if (result?.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        
        // Refrescar el balance después del login exitoso
        if (window.refreshMoneyContext) {
          setTimeout(() => {
            window.refreshMoneyContext();
          }, 1000); // Pequeño delay para asegurar que se complete la aplicación de datos
        }
        
        return { success: true };
      } else {
        const msg = result?.error || 'Credenciales inválidas';
        dispatch({ type: 'LOGIN_ERROR', payload: msg });
        return { success: false, error: msg };
      }
    } catch {
      const errorMessage = 'Error al iniciar sesión';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await authService.register(userData);
      if (result?.success) {
        // Guardar la sesión después del registro exitoso
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        
        // Refrescar el balance después del registro exitoso
        if (window.refreshMoneyContext) {
          setTimeout(() => {
            window.refreshMoneyContext();
          }, 1000); // Pequeño delay para asegurar que se complete la aplicación de datos
        }
        
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: true, user: result.user };
      } else {
        const msg = result?.error || 'Error al registrar usuario';
        dispatch({ type: 'SET_LOADING', payload: false });
        return { success: false, error: msg, errors: result?.errors };
      }
    } catch {
      const errorMessage = 'Error al registrar usuario';
      dispatch({ type: 'SET_LOADING', payload: false });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    try { authService.logout(); } catch {}
    dispatch({ type: 'LOGOUT' });
  };

  // Actualiza en backend y sincroniza contexto
  const updateProfile = async (userData) => {
    try {
      const result = await authService.updateMe(userData);
      if (result?.success) {
        dispatch({ type: 'UPDATE_USER', payload: result.user });
        return { success: true };
      } else {
        return { success: false, error: result?.error || 'Error al actualizar perfil' };
      }
    } catch {
      return { success: false, error: 'Error al actualizar perfil' };
    }
  };

  const deleteAccount = async () => {
    try {
      const result = await authService.deleteMe();
      if (result?.success) {
        dispatch({ type: 'LOGOUT' });
        return { success: true };
      } else {
        return { success: false, error: result?.error || 'No se pudo eliminar la cuenta' };
      }
    } catch {
      return { success: false, error: 'No se pudo eliminar la cuenta' };
    }
  };

  const changePassword = async (current_password, new_password) => {
    try {
      const result = await authService.changePassword(current_password, new_password);
      if (result?.success) return { success: true };
      return { success: false, error: result?.error || 'No se pudo cambiar la contraseña' };
    } catch {
      return { success: false, error: 'No se pudo cambiar la contraseña' };
    }
  };

  const forgotPassword = async () => ({ success: true });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });
  const isAdmin = () => false;
  const getAllUsers = async () => ({ success: true, users: [] });

  const value = {
    isAuthenticated: state.isAuthenticated,
    user: state.user,           // { id, nombre, correo }
    loading: state.loading,
    error: state.error,

    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    changePassword,
    forgotPassword,
    clearError,
    isAdmin,
    getAllUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser usado dentro de AuthProvider');
  return context;
};
