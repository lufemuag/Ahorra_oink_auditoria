import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

// Estados de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null
      };
    
    case 'LOGIN_ERROR':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const checkAuth = () => {
      // Inicializar usuario administrador por defecto
      authService.initializeDefaultAdmin();
      
      if (authService.isAuthenticated()) {
        const user = authService.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login
  const login = async (username, password) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const result = authService.login(username, password);
      
      if (result.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error al iniciar sesión';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Register
  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: result.user });
        return { success: true };
      } else {
        dispatch({ type: 'LOGIN_ERROR', payload: result.error });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Error al registrar usuario';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  // Update profile
  const updateProfile = async (userData) => {
    try {
      const result = authService.updateProfile(userData);
      
      if (result.success) {
        dispatch({ type: 'UPDATE_USER', payload: result.user });
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Error al actualizar perfil' };
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const result = authService.changePassword(currentPassword, newPassword);
      return result;
    } catch (error) {
      return { success: false, error: 'Error al cambiar contraseña' };
    }
  };

  // Forgot password
  const forgotPassword = async (username) => {
    try {
      const result = authService.forgotPassword(username);
      return result;
    } catch (error) {
      return { success: false, error: 'Error al enviar recuperación' };
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Check if user is admin
  const isAdmin = () => {
    return authService.isAdmin();
  };

  // Get all users (admin only)
  const getAllUsers = async () => {
    try {
      const result = authService.getAllUsers();
      return result;
    } catch (error) {
      return { success: false, error: 'Error al obtener usuarios' };
    }
  };

  const value = {
    // State
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    loading: state.loading,
    error: state.error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    clearError,
    isAdmin,
    getAllUsers
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  
  return context;
};