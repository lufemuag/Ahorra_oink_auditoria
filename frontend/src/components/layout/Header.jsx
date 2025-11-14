// src/components/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAchievements } from '../../context/AchievementsContext'; // 👈 NUEVO
import {
  FaUser, FaTimes, FaSignOutAlt, FaTrophy, FaChartLine, FaBook, FaCog, FaChevronDown, FaShieldAlt
} from 'react-icons/fa';
import logoImage from '../../assets/logo.png';
import menuIcon from '../../assets/iconomenu.png';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { unlockAchievement } = useAchievements(); // 👈 NUEVO
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCoinsMenuOpen, setIsCoinsMenuOpen] = useState(false);

  // Datos del usuario
  const displayName = user?.nombre || 'Usuario';
  const displayEmail = user?.correo || '';
  const displayHandle = displayEmail ? `@${displayEmail.split('@')[0]}` : '@usuario';

  const coinsMenuItems = [
    { name: 'Logros',        href: '/achievements',   icon: FaTrophy },
    { name: 'Gastos',        href: '/expenses',       icon: FaChartLine },
    { name: 'Estadísticas',  href: '/statistics',     icon: FaChartLine },
    { name: 'Metodologías',  href: '/methodologies',  icon: FaBook },
    { name: 'Configuración', href: '/settings',       icon: FaCog },
    ...(user?.correo === 'admin@pascualbravo.edu.co' ? [{ name: 'Administrador', href: '/admin', icon: FaShieldAlt }] : []),
    { name: 'Cerrar sesión', action: 'logout',        icon: FaSignOutAlt },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setIsCoinsMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const toggleMobileMenu = () => { setIsMobileMenuOpen(o => !o); setIsCoinsMenuOpen(false); };
  const closeMobileMenu  = () => setIsMobileMenuOpen(false);
  const toggleCoinsMenu  = () => { setIsCoinsMenuOpen(o => !o); setIsMobileMenuOpen(false); };
  const closeCoinsMenu   = () => setIsCoinsMenuOpen(false);

  // ========= 🔔 Integración global de logros =========
  useEffect(() => {
    if (!isAuthenticated) return;

    // A) Escuchar CustomEvent global: window.dispatchEvent(new CustomEvent('unlock-achievement', { detail: { id: N } }))
    const onUnlockEvent = (e) => {
      const id = Number(e?.detail?.id);
      if (Number.isFinite(id)) unlockAchievement(id);
    };
    window.addEventListener('unlock-achievement', onUnlockEvent);

    // B) Exponer helper global (opcional): window.unlockAchievement(N)
    window.unlockAchievement = (id) => {
      const n = Number(id);
      if (Number.isFinite(n)) unlockAchievement(n);
    };

    return () => {
      window.removeEventListener('unlock-achievement', onUnlockEvent);
      delete window.unlockAchievement;
    };
  }, [isAuthenticated, unlockAchievement]);
  // ================================================

  if (!isAuthenticated) return null;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/dashboard" className="header-logo" onClick={closeMobileMenu}>
          <img src={logoImage} alt="Ahorra Oink" className="logo-img" />
        </Link>

        {/* Bienvenida al usuario */}
        <div className="header-user">
          <FaUser className="header-user-icon" />
          <span className="header-user-name">Hola, {displayName}</span>
        </div>

        {/* Coins Menu - Desktop */}
        <div className="header-coins-menu desktop-coins-menu">
          <button className="coins-menu-btn" onClick={toggleCoinsMenu} title="Menú de opciones">
            <img src={menuIcon} alt="Opciones" className="coins-img" />
            <FaChevronDown className={`chevron-icon ${isCoinsMenuOpen ? 'rotated' : ''}`} />
          </button>

          {isCoinsMenuOpen && (
            <div className="coins-dropdown">
              {coinsMenuItems.map((item) => {
                const Icon = item.icon;
                return item.action === 'logout' ? (
                  <button
                    key={item.name}
                    type="button"
                    className="coins-menu-item as-button"
                    onClick={handleLogout}
                  >
                    <Icon className="coins-menu-icon" />
                    <span>{item.name}</span>
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="coins-menu-item"
                    onClick={closeCoinsMenu}
                  >
                    <Icon className="coins-menu-icon" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Botón menú móvil */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Abrir menú">
          <img src={menuIcon} alt="Menú" className="menu-img" />
        </button>
      </div>

      {/* Menú móvil */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="mobile-close-btn" onClick={closeMobileMenu} aria-label="Cerrar menú">
          <FaTimes />
        </button>

        <div className="mobile-user-info">
          <div className="user-avatar"><FaUser /></div>
          <div>
            <div className="user-name">{displayName}</div>
            <div className="user-email">{displayHandle}</div>
          </div>
        </div>

        <nav className="mobile-nav">
          {coinsMenuItems.map((item) => {
            const Icon = item.icon;
            return item.action === 'logout' ? (
              <button
                key={item.name}
                type="button"
                className="mobile-nav-link as-button"
                onClick={handleLogout}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
              </button>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="mobile-nav-link"
                onClick={closeMobileMenu}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Overlays */}
      {isMobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu} />}
      {isCoinsMenuOpen &&  <div className="coins-menu-overlay"  onClick={closeCoinsMenu}  />}
    </header>
  );
};

export default Header;
