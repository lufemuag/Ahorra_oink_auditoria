import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUser, 
  FaHome, 
  FaInfoCircle, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaPiggyBank,
  FaUserShield,
  FaLifeRing
} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/dashboard', icon: FaHome },
    { name: 'Perfil', href: '/profile', icon: FaUser },
    { name: 'Información', href: '/information', icon: FaInfoCircle },
    { name: 'Soporte', href: '/support', icon: FaLifeRing },
  ];

  // Agregar enlace de admin solo para administradores
  if (isAdmin && isAdmin()) {
    navigation.push({ name: 'Admin', href: '/admin', icon: FaUserShield });
  }

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/dashboard" className="header-logo" onClick={closeMobileMenu}>
          <FaPiggyBank className="logo-icon" />
          <span className="logo-text">Ahorra Oink</span>
        </Link>

        {/* Navigation - Desktop */}
        <nav className="header-nav desktop-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Menu - Desktop */}
        <div className="header-user desktop-user">
          <div className="user-info">
            <span className="user-greeting">¡Hola, {user?.firstName || 'Usuario'}!</span>
            <span className="user-email">@{user?.username || 'usuario'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Cerrar sesión">
            <FaSignOutAlt />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-user-info">
          <div className="user-avatar">
            <FaUser />
          </div>
          <div>
            <div className="user-name">{user?.firstName || 'Usuario'} {user?.lastName || ''}</div>
            <div className="user-email">@{user?.username || 'usuario'}</div>
          </div>
        </div>

        <nav className="mobile-nav">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobileMenu}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="mobile-logout-btn">
          <FaSignOutAlt className="nav-icon" />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
      )}
    </header>
  );
};

export default Header;