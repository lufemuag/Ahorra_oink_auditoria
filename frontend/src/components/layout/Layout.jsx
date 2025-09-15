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
  
  return (
    <div className={`app-layout ${isDashboard ? 'dashboard-layout' : ''} ${isExpenses ? 'expenses-layout' : ''} ${isAchievements ? 'achievements-layout' : ''} ${isStatistics ? 'statistics-layout' : ''}`}>
      <Header />
      <main className={`main-content ${isDashboard ? 'dashboard-main' : ''} ${isExpenses ? 'expenses-main' : ''} ${isAchievements ? 'achievements-main' : ''} ${isStatistics ? 'statistics-main' : ''}`}>
        <div className={`container ${isDashboard ? 'dashboard-container' : ''} ${isExpenses ? 'expenses-container' : ''} ${isAchievements ? 'achievements-container' : ''} ${isStatistics ? 'statistics-container' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;