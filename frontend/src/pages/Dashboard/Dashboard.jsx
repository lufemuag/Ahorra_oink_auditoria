import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaPiggyBank, 
  FaDollarSign, 
  FaChartLine, 
  FaBullseye,
  FaPlus,
  FaBell
} from 'react-icons/fa';
import AddIncomeModal from '../../components/dashboard/AddIncomeModal';
import AddExpenseModal from '../../components/dashboard/AddExpenseModal';
import AddGoalModal from '../../components/dashboard/AddGoalModal';
import NotificationsModal from '../../components/dashboard/NotificationsModal';
import { transactionService } from '../../services/transactionService';
import { goalService } from '../../services/goalService';
import { notificationService } from '../../services/notificationService';
import { achievementService } from '../../services/achievementService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados de los modales
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  
  // Estados de los datos
  const [stats, setStats] = useState({
    totalSavings: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsGoalProgress: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [goals, setGoals] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = () => {
    // Cargar estadísticas del usuario
    const userStats = transactionService.getUserStats(user.id);
    setStats({
      totalSavings: userStats.totalSavings,
      monthlyIncome: userStats.totalIncome,
      monthlyExpenses: userStats.totalExpenses,
      savingsGoalProgress: userStats.totalSavings > 0 ? Math.min(100, (userStats.totalSavings / 10000) * 100) : 0
    });

    // Cargar transacciones recientes (últimas 5)
    const allTransactions = transactionService.getByUser(user.id);
    const sortedTransactions = allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentTransactions(sortedTransactions);

    // Cargar metas activas
    const activeGoals = goalService.getActive(user.id);
    setGoals(activeGoals);

    // Cargar contador de notificaciones no leídas
    const unreadNotifications = notificationService.getUnread(user.id);
    setUnreadNotificationsCount(unreadNotifications.length);
  };

  const quickActions = [
    {
      title: 'Agregar Saldo',
      icon: FaPlus,
      color: 'success',
      action: () => setIsIncomeModalOpen(true)
    },
    {
      title: 'Gastos',
      icon: FaPlus,
      color: 'danger',
      action: () => setIsExpenseModalOpen(true)
    },
    {
      title: 'Nueva Meta',
      icon: FaBullseye,
      color: 'primary',
      action: () => setIsGoalModalOpen(true)
    }
  ];

  // Funciones de callback para los modales
  const handleTransactionSuccess = (transaction) => {
    loadDashboardData(); // Recargar datos después de agregar transacción
    
    // Verificar logros después de agregar transacción
    if (transaction) {
      const achievementResult = achievementService.checkSpecificAchievements(
        user.id, 
        'transaction', 
        { type: transaction.type, amount: transaction.amount }
      );
      
      if (achievementResult.success && achievementResult.newAchievements.length > 0) {
        // Mostrar notificación de logros desbloqueados
        achievementResult.newAchievements.forEach(achievement => {
          notificationService.create({
            userId: user.id,
            type: 'success',
            title: `🏆 ¡Logro Desbloqueado!`,
            message: `${achievement.name}: ${achievement.description}`,
            priority: 'high'
          });
        });
        
        // Recargar contador de notificaciones
        loadDashboardData();
      }
    }
  };

  const handleGoalSuccess = (goal) => {
    loadDashboardData(); // Recargar datos después de agregar meta
    
    // Verificar logros después de agregar meta
    if (goal) {
      const achievementResult = achievementService.checkSpecificAchievements(
        user.id, 
        'goal_created', 
        goal
      );
      
      if (achievementResult.success && achievementResult.newAchievements.length > 0) {
        // Mostrar notificación de logros desbloqueados
        achievementResult.newAchievements.forEach(achievement => {
          notificationService.create({
            userId: user.id,
            type: 'success',
            title: `🏆 ¡Logro Desbloqueado!`,
            message: `${achievement.name}: ${achievement.description}`,
            priority: 'high'
          });
        });
        
        // Recargar contador de notificaciones
        loadDashboardData();
      }
    }
  };

  // Función para manejar actualización de notificaciones
  const handleNotificationUpdate = () => {
    loadDashboardData();
  };

  // Función para navegar a transacciones
  const handleViewAllTransactions = () => {
    navigate('/transactions');
  };

  return (
    <div className="dashboard">
      {/* Header de bienvenida */}
      <div className="dashboard-header animate-fade-in">
        <div className="welcome-section">
          <h1>¡Hola, {user?.firstName}! 🐷</h1>
          <p>Aquí está el resumen de tus finanzas</p>
        </div>
        <div 
          className="notifications-icon"
          onClick={() => setIsNotificationsModalOpen(true)}
          style={{ cursor: 'pointer' }}
        >
          <FaBell />
          {unreadNotificationsCount > 0 && (
            <span className="notification-badge">{unreadNotificationsCount}</span>
          )}
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="stats-grid animate-slide-in">
        <div className="stat-card savings">
          <div className="stat-icon">
            <FaPiggyBank />
          </div>
          <div className="stat-info">
            <h3>Total Ahorrado</h3>
            <p className="stat-value">${stats.totalSavings.toLocaleString()}</p>
            <span className="stat-change positive">+12% este mes</span>
          </div>
        </div>

        <div className="stat-card income">
          <div className="stat-icon">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Ingresos del Mes</h3>
            <p className="stat-value">${stats.monthlyIncome.toLocaleString()}</p>
            <span className="stat-change positive">+5% vs mes anterior</span>
          </div>
        </div>

        <div className="stat-card expenses">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <h3>Gastos del Mes</h3>
            <p className="stat-value">${stats.monthlyExpenses.toLocaleString()}</p>
            <span className="stat-change negative">+8% vs mes anterior</span>
          </div>
        </div>

        <div className="stat-card goals">
          <div className="stat-icon">
            <FaBullseye />
          </div>
          <div className="stat-info">
            <h3>Meta de Ahorro</h3>
            <p className="stat-value">{stats.savingsGoalProgress}%</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.savingsGoalProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="quick-actions animate-fade-in">
        <h2>Acciones Rápidas</h2>
        <div className="actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className={`action-btn ${action.color}`}
                onClick={action.action}
              >
                <Icon className="action-icon" />
                <span>{action.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Transacciones recientes */}
      <div className="recent-transactions animate-slide-in">
        <div className="section-header">
          <h2>Transacciones Recientes</h2>
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleViewAllTransactions}
          >
            Ver todas
          </button>
        </div>
        <div className="transactions-list">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <span className="transaction-description">
                  {transaction.description}
                </span>
                <span className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <span className={`transaction-amount ${transaction.type}`}>
                {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recordatorios y tips */}
      <div className="tips-section animate-fade-in">
        <div className="tip-card">
          <h3>💡 Consejo del día</h3>
          <p>
            {stats.totalSavings > 0 
              ? `¡Excelente trabajo! Has ahorrado $${stats.totalSavings.toLocaleString()}. Considera crear una nueva meta para seguir motivado.`
              : '¡Comienza tu viaje de ahorro! Agrega tu primer ingreso y crea una meta para mantenerte motivado.'
            }
          </p>
        </div>
      </div>

      {/* Modales */}
      <AddIncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={handleTransactionSuccess}
      />
      
      <AddGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSuccess={handleGoalSuccess}
      />

      <NotificationsModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onNotificationUpdate={handleNotificationUpdate}
      />
    </div>
  );
};

export default Dashboard;