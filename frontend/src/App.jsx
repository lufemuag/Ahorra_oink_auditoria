// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { MoneyProvider } from './context/MoneyContext';
import AchievementsProvider from './context/AchievementsContext'; // 👈 NUEVO

import PublicRoute from './components/common/PublicRoute';
import ProtectedLayout from './components/layout/ProtectedLayout'; // ProtectedRoute + Layout + <Outlet/>

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';
import TermsAndConditions from './pages/Auth/TermsAndConditions';

import Layout from './components/layout/Layout'; // Header adaptativo dentro
import Dashboard from './pages/Dashboard/Dashboard';

import Achievements from './pages/Achievements/Achievements';
import Expenses from './pages/Expenses/Expenses';           // 👈 oficial (con Cabez.png)
import Statistics from './pages/Statistics/Statistics';
import Methodologies from './pages/Methodologies/Methodologies';
import Settings from './pages/Settings/Settings';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserRecovery from './pages/Admin/UserRecovery';
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
        {/* 👇 Proveedor global de logros + notificación a pantalla completa */}
        <AchievementsProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* ======= Públicas SIN login ======= */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                <Route path="/terms-and-conditions" element={<PublicRoute><TermsAndConditions /></PublicRoute>} />

                {/* Dashboard PÚBLICO con header adaptativo */}
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />

                {/* Métodos de ahorro PÚBLICOS (sin login requerido) */}
                <Route path="/metodos" element={<Layout><Methods /></Layout>} />
                <Route path="/metodo-50-30-20" element={<Layout><Method50_30_20 /></Layout>} />
                <Route path="/metodo-sobres" element={<Layout><MethodSobres /></Layout>} />
                <Route path="/ahorro-automatico" element={<Layout><AhorroAutomatico /></Layout>} />
                <Route path="/ahorro-1dolar" element={<Layout><Ahorro1Dolar /></Layout>} />
                <Route path="/metodo-redondeo" element={<Layout><MetodoRedondeo /></Layout>} />

                {/* ======= PROTEGIDAS (requieren token + Layout con Header) ======= */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/methodologies" element={<Methodologies />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/recovery" element={<UserRecovery />} />
                </Route>

                {/* Raíz → dashboard público */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* 404 */}
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
        </AchievementsProvider>
      </MoneyProvider>
    </AuthProvider>
  );
}

export default App;
