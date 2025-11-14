import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  
  // Usar try-catch para manejar errores del contexto
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    console.error('Error en ProtectedRoute:', error);
    // Si hay error con el contexto, redirigir al login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const { isAuthenticated, loading } = authContext;

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardar la ubicación que intentaba visitar para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
