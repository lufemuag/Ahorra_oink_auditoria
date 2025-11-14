// src/components/layout/Layout.jsx
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';   // header para logeados (usa user + logout)
import Header2 from './Header2'; // header público mínimo
import './Layout.css';

function getVariant(pathname) {
  if (pathname === '/dashboard') return 'dashboard';
  if (pathname === '/expenses') return 'expenses';
  if (pathname === '/achievements') return 'achievements';
  if (pathname === '/statistics') return 'statistics';
  if (pathname === '/methodologies') return 'methodologies';
  if (pathname === '/settings') return 'settings';
  if (pathname === '/metodos') return 'methods';
  if (pathname.startsWith('/metodo-') || pathname.startsWith('/ahorro-')) return 'method';

  // páginas de auth: layout neutro si algún día las pasas por aquí
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/reset-password' ||
    pathname === '/terms-and-conditions'
  ) return null;

  return null;
}

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();

  const variant = useMemo(() => getVariant(pathname), [pathname]);

  const rootClass = ['app-layout', variant ? `${variant}-layout` : ''].filter(Boolean).join(' ');
  const mainClass = ['main-content', variant ? `${variant}-main` : ''].filter(Boolean).join(' ');
  const containerClass = ['container', variant ? `${variant}-container` : ''].filter(Boolean).join(' ');

  return (
    <div className={rootClass}>
      {/* Header privado si hay sesión; si no, Header2 público */}
      {isAuthenticated ? <Header /> : <Header2 />}

      <main className={mainClass}>
        <div className={containerClass}>
          {children}
        </div>
      </main>
    </div>
  );
}
