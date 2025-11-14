// src/components/layout/Header2.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.png';
import './Header2.css';

const Header2 = () => {
  return (
    <header className="header2">
      <div className="header2-container">
        {/* Logo */}
        <Link to="/dashboard" className="header2-logo">
          <img src={logoImage} alt="Ahorra Oink" className="logo-img" />
        </Link>

        {/* Acciones públicas (opcional) */}
        <nav className="header2-actions">
          <Link to="/login" className="header2-link">Iniciar sesión</Link>
          <Link to="/register" className="header2-link">Registrarse</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header2;
