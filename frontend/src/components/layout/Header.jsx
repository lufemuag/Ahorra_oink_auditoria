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
  FaLifeRing,
  FaCoins,
  FaTrophy,
  FaChartLine,
  FaBook,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoinsMenuOpen, setIsCoinsMenuOpen] = useState(false);

  // Ya no necesitamos navegación tradicional, solo el menú de monedas

  const coinsMenuItems = [
    { name: 'Logros', href: '/achievements', icon: FaTrophy },
    { name: 'Gastos', href: '/expenses', icon: FaChartLine },
    { name: 'Estadísticas', href: '/statistics', icon: FaChartLine },
    { name: 'Metodologías', href: '/methodologies', icon: FaBook },
    { name: 'Configuración', href: '/settings', icon: FaCog },
    { name: 'Cerrar sesión', href: '#', icon: FaSignOutAlt, action: 'logout' }
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsCoinsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsCoinsMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleCoinsMenu = () => {
    setIsCoinsMenuOpen(!isCoinsMenuOpen);
    setIsMobileMenuOpen(false);
  };

  const closeCoinsMenu = () => {
    setIsCoinsMenuOpen(false);
  };

  const handleCoinsMenuItemClick = (item) => {
    if (item.action === 'logout') {
      handleLogout();
    } else {
      closeCoinsMenu();
    }
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

        {/* Navigation removed - only coins menu */}

        {/* Coins Menu - Desktop */}
        <div className="header-coins-menu desktop-coins-menu">
          <button 
            className="coins-menu-btn"
            onClick={toggleCoinsMenu}
            title="Menú de opciones"
          >
            <FaCoins className="coins-icon" />
            <FaChevronDown className={`chevron-icon ${isCoinsMenuOpen ? 'rotated' : ''}`} />
          </button>

          {isCoinsMenuOpen && (
            <div className="coins-dropdown">
              {coinsMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="coins-menu-item"
                    onClick={() => handleCoinsMenuItemClick(item)}
                  >
                    <Icon className="coins-menu-icon" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* User info removed - only coins menu */}

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu - Simplified */}
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
          {coinsMenuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className="mobile-nav-link"
                onClick={() => handleCoinsMenuItemClick(item)}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobileMenu} />
      )}

      {/* Coins Menu Overlay */}
      {isCoinsMenuOpen && (
        <div className="coins-menu-overlay" onClick={closeCoinsMenu} />
      )}
    </header>
  );
};

export default Header;