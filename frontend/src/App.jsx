import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MoneyProvider } from './context/MoneyContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import TermsAndConditions from './pages/Auth/TermsAndConditions';
import Dashboard from './pages/Dashboard/Dashboard';
import Achievements from './pages/Achievements/Achievements';
import Expenses from './pages/Expenses/Expenses';
import Statistics from './pages/Statistics/Statistics';
import Methodologies from './pages/Methodologies/Methodologies';
import Settings from './pages/Settings/Settings';
import Methods from './pages/Methods/Methods';
import Method50_30_20 from './pages/Method50-30-20/Method50-30-20';
import MethodSobres from './pages/MethodSobres/MethodSobres';
import AhorroAutomatico from './pages/AhorroAutomatico/AhorroAutomatico';
import Ahorro1Dolar from './pages/Ahorro1Dolar/Ahorro1Dolar';
import MetodoRedondeo from './pages/MetodoRedondeo/MetodoRedondeo';
import './styles/globals.css';

function App() {
  return (
    <AuthProvider>
      <MoneyProvider>
        <Router>
        <div className="app">
          <Routes>
            {/* Rutas públicas (autenticación) */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            
            {/* Rutas protegidas */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Solo páginas del coins-menu */}
            
            <Route 
              path="/achievements" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Achievements />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/expenses" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Expenses />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/statistics" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Statistics />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/methodologies" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Methodologies />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Rutas de métodos de ahorro */}
            <Route 
              path="/metodos" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Methods />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/metodo-50-30-20" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Method50_30_20 />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/metodo-sobres" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MethodSobres />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/ahorro-automatico" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <AhorroAutomatico />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/ahorro-1dolar" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Ahorro1Dolar />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/metodo-redondeo" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MetodoRedondeo />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Ruta 404 */}
            <Route 
              path="*" 
              element={
                <div className="flex-center" style={{ minHeight: '100vh' }}>
                  <div className="card text-center">
                    <h2>Página no encontrada</h2>
                    <p>La página que buscas no existe.</p>
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
        </Router>
      </MoneyProvider>
    </AuthProvider>
  );
}

export default App;
