import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const isExpenses = location.pathname === '/expenses';
  const isAchievements = location.pathname === '/achievements';
  const isStatistics = location.pathname === '/statistics';
  const isMethodologies = location.pathname === '/methodologies';
  const isSettings = location.pathname === '/settings';
  const isMethods = location.pathname === '/metodos';
  const isMethod = location.pathname.startsWith('/metodo') || location.pathname.startsWith('/ahorro');
  
  return (
    <div className={`app-layout ${isDashboard ? 'dashboard-layout' : ''} ${isExpenses ? 'expenses-layout' : ''} ${isAchievements ? 'achievements-layout' : ''} ${isStatistics ? 'statistics-layout' : ''} ${isMethodologies ? 'methodologies-layout' : ''} ${isSettings ? 'settings-layout' : ''} ${isMethods ? 'methods-layout' : ''} ${isMethod ? 'method-layout' : ''}`}>
      <Header />
      <main className={`main-content ${isDashboard ? 'dashboard-main' : ''} ${isExpenses ? 'expenses-main' : ''} ${isAchievements ? 'achievements-main' : ''} ${isStatistics ? 'statistics-main' : ''} ${isMethodologies ? 'methodologies-main' : ''} ${isSettings ? 'settings-main' : ''} ${isMethods ? 'methods-main' : ''} ${isMethod ? 'method-main' : ''}`}>
        <div className={`container ${isDashboard ? 'dashboard-container' : ''} ${isExpenses ? 'expenses-container' : ''} ${isAchievements ? 'achievements-container' : ''} ${isStatistics ? 'statistics-container' : ''} ${isMethodologies ? 'methodologies-container' : ''} ${isSettings ? 'settings-container' : ''} ${isMethods ? 'methods-container' : ''} ${isMethod ? 'method-container' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;