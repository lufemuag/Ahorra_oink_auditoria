import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/adminService';
import { FaUsers, FaDollarSign, FaChartLine, FaPiggyBank, FaEye, FaEdit, FaTrashRestore } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [statistics, setStatistics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [dashboardResult, usersResult] = await Promise.all([
        adminService.getDashboard(),
        adminService.getAllUsers()
      ]);

      if (dashboardResult.success) {
        setStatistics(dashboardResult.statistics);
      } else {
        setError(dashboardResult.error);
      }

      if (usersResult.success) {
        setUsers(usersResult.users);
      } else {
        setError(usersResult.error);
      }
    } catch (err) {
      setError('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const result = await adminService.getUserDetail(userId);
      if (result.success) {
        setSelectedUser(result.user);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error al cargar detalles del usuario');
    }
  };

  if (!user || !user.correo || user.correo !== 'admin@pascualbravo.edu.co') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Acceso Denegado</h2>
          <p>No tienes permisos de administrador para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando dashboard de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Gestión completa del sistema Ahorra Oink</p>
        <div className="admin-actions">
          <a href="/admin/recovery" className="admin-action-btn">
            <FaTrashRestore />
            Recuperar Cuentas
          </a>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {statistics && (
        <div className="stats-grid">
          {/* Estadísticas principales */}
          <div className="stat-card">
            <div className="stat-icon">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{statistics.users.total}</h3>
              <p>Total Usuarios</p>
              <small>{statistics.users.active} activos este mes</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h3>${statistics.transactions.balance.toLocaleString()}</h3>
              <p>Balance Total</p>
              <small>Ingresos: ${statistics.transactions.income.toLocaleString()}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-content">
              <h3>{statistics.transactions.total}</h3>
              <p>Total Transacciones</p>
              <small>Gastos: ${statistics.transactions.expense.toLocaleString()}</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaPiggyBank />
            </div>
            <div className="stat-content">
              <h3>${statistics.transactions.savings.toLocaleString()}</h3>
              <p>Total Ahorros</p>
              <small>Promedio por usuario</small>
            </div>
          </div>
        </div>
      )}

      {/* Lista de usuarios */}
      <div className="users-section">
        <h2>Usuarios del Sistema</h2>
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Transacciones</th>
                <th>Balance</th>
                <th>Metas de Ahorro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombrecompleto}</td>
                  <td>{user.correo}</td>
                  <td>{user.transaction_count}</td>
                  <td className={user.balance >= 0 ? 'positive' : 'negative'}>
                    ${user.balance.toLocaleString()}
                  </td>
                  <td>{user.savings_goals_count}</td>
                  <td>
                    <button 
                      className="action-btn view-btn"
                      onClick={() => handleViewUser(user.id)}
                      title="Ver detalles"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => window.open(`http://localhost:8000/admin/accounts/usuario/${user.id}/change/`, '_blank')}
                      title="Editar en admin"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de detalles de usuario */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de {selectedUser.nombrecompleto}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="user-info">
                <h3>Información Personal</h3>
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Nombre:</strong> {selectedUser.nombrecompleto}</p>
                <p><strong>Correo:</strong> {selectedUser.correo}</p>
              </div>

              <div className="user-stats">
                <h3>Estadísticas Financieras</h3>
                <div className="stats-row">
                  <div className="stat-item">
                    <span className="stat-label">Total Transacciones:</span>
                    <span className="stat-value">{selectedUser.statistics.total_transactions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ingresos:</span>
                    <span className="stat-value positive">${selectedUser.statistics.total_income.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Gastos:</span>
                    <span className="stat-value negative">${selectedUser.statistics.total_expense.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ahorros:</span>
                    <span className="stat-value positive">${selectedUser.statistics.total_savings.toLocaleString()}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Balance:</span>
                    <span className={`stat-value ${selectedUser.statistics.balance >= 0 ? 'positive' : 'negative'}`}>
                      ${selectedUser.statistics.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="recent-transactions">
                <h3>Transacciones Recientes</h3>
                <div className="transactions-list">
                  {selectedUser.recent_transactions.slice(0, 10).map(tx => (
                    <div key={tx.id} className="transaction-item">
                      <div className="tx-info">
                        <span className={`tx-type ${tx.type}`}>
                          {tx.type === 'income' ? '💰' : tx.type === 'savings' ? '🏦' : '💸'}
                        </span>
                        <span className="tx-description">{tx.description}</span>
                        <span className="tx-category">{tx.category || 'Sin categoría'}</span>
                      </div>
                      <div className="tx-amount">
                        ${tx.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="savings-goals">
                <h3>Metas de Ahorro</h3>
                <div className="goals-list">
                  {selectedUser.savings_goals.map(goal => (
                    <div key={goal.id} className="goal-item">
                      <div className="goal-info">
                        <h4>{goal.name}</h4>
                        <p>${goal.current_amount.toLocaleString()} / ${goal.target_amount.toLocaleString()}</p>
                      </div>
                      <div className="goal-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${goal.progress_percentage}%` }}
                          ></div>
                        </div>
                        <span className="progress-text">{goal.progress_percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;