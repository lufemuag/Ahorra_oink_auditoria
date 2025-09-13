import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { adminUserService } from '../../services/adminUserService';
import CreateUserModal from '../../components/admin/CreateUserModal';
import TicketDetailsModal from '../../components/admin/TicketDetailsModal';
import EditUserModal from '../../components/admin/EditUserModal';
import DeleteUserModal from '../../components/admin/DeleteUserModal';
import { 
  FaUsers, 
  FaTicketAlt, 
  FaChartBar, 
  FaCog,
  FaUserPlus,
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, getAllUsers, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTickets: 0,
    totalSavings: 0,
    newUsersThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const [modals, setModals] = useState({
    createUser: false,
    ticketDetails: false,
    editUser: false,
    deleteUser: false
  });
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (!isAdmin()) {
      return;
    }

    loadAdminData();
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Cargar usuarios usando el servicio de admin
      const usersResult = adminUserService.getAllUsers();
      if (usersResult.success) {
        setUsers(usersResult.users);
        calculateStats(usersResult.users);
      }

      // Cargar tickets
      const ticketsResult = ticketService.getAllTickets();
      if (ticketsResult.success) {
        setTickets(ticketsResult.tickets);
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (usersList) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const totalSavings = usersList.reduce((sum, user) => sum + (user.stats?.totalSavings || 0), 0);
    const newUsersThisWeek = usersList.filter(user => 
      new Date(user.createdAt) >= oneWeekAgo
    ).length;

    setStats({
      totalUsers: usersList.length,
      activeTickets: tickets.filter(t => t.status !== 'closed').length,
      totalSavings,
      newUsersThisWeek
    });
  };

  const handleTicketStatusUpdate = async (ticketId, newStatus) => {
    const result = ticketService.updateTicketStatus(ticketId, newStatus);
    if (result.success) {
      setTickets(tickets.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() }
          : ticket
      ));
    }
  };

  // Funciones para manejar modales
  const openModal = (modalType, data = null) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
    if (data) {
      setSelectedTicketId(data);
    }
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
    if (modalType === 'ticketDetails') {
      setSelectedTicketId(null);
    }
  };

  // Función para manejar éxito de crear usuario
  const handleUserCreated = () => {
    loadAdminData(); // Recargar datos
  };

  // Función para manejar éxito de editar usuario
  const handleUserUpdated = () => {
    loadAdminData(); // Recargar datos
  };

  // Función para manejar eliminación de usuario
  const handleUserDeleted = () => {
    loadAdminData(); // Recargar datos
  };

  // Función para abrir modal de editar usuario
  const handleEditUser = (userId) => {
    setSelectedUserId(userId);
    openModal('editUser');
  };

  // Función para abrir modal de eliminar usuario
  const handleDeleteUser = (userId) => {
    setSelectedUserId(userId);
    openModal('deleteUser');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaExclamationTriangle className="status-icon open" />;
      case 'in_progress': return <FaClock className="status-icon in-progress" />;
      case 'closed': return <FaCheckCircle className="status-icon closed" />;
      default: return <FaTimesCircle className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'danger';
      case 'in_progress': return 'warning';  
      case 'closed': return 'success';
      default: return 'secondary';
    }
  };

  if (!isAdmin()) {
    return (
      <div className="admin-error">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder al panel de administración.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loader"></div>
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <h1>Panel de Administración</h1>
        <p>Bienvenido, {user?.firstName}. Gestiona usuarios, tickets y estadísticas.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FaChartBar /> Resumen
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUsers /> Usuarios
        </button>
        <button 
          className={`tab ${activeTab === 'tickets' ? 'active' : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          <FaTicketAlt /> Tickets
        </button>
        <button 
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <FaCog /> Configuración
        </button>
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card users">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <h3>Total Usuarios</h3>
                  <p className="stat-value">{stats.totalUsers}</p>
                  <span className="stat-subtitle">
                    {stats.newUsersThisWeek} nuevos esta semana
                  </span>
                </div>
              </div>

              <div className="stat-card tickets">
                <div className="stat-icon">
                  <FaTicketAlt />
                </div>
                <div className="stat-info">
                  <h3>Tickets Activos</h3>
                  <p className="stat-value">{stats.activeTickets}</p>
                  <span className="stat-subtitle">
                    {tickets.filter(t => t.status === 'open').length} sin responder
                  </span>
                </div>
              </div>

              <div className="stat-card savings">
                <div className="stat-icon">
                  <FaChartBar />
                </div>
                <div className="stat-info">
                  <h3>Ahorros Totales</h3>
                  <p className="stat-value">${stats.totalSavings.toLocaleString()}</p>
                  <span className="stat-subtitle">Suma de todos los usuarios</span>
                </div>
              </div>

              <div className="stat-card growth">
                <div className="stat-icon">
                  <FaUserPlus />
                </div>
                <div className="stat-info">
                  <h3>Crecimiento</h3>
                  <p className="stat-value">+{Math.round((stats.newUsersThisWeek / stats.totalUsers) * 100)}%</p>
                  <span className="stat-subtitle">Esta semana</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
              <h3>Actividad Reciente</h3>
              <div className="activity-list">
                {tickets.slice(0, 5).map(ticket => (
                  <div key={ticket.id} className="activity-item">
                    {getStatusIcon(ticket.status)}
                    <div className="activity-info">
                      <span className="activity-title">{ticket.title}</span>
                      <span className="activity-meta">
                        Por {ticket.userName} - {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="tab-header">
              <h3>Gestión de Usuarios</h3>
              <div className="tab-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => openModal('createUser')}
                >
                  <FaUserPlus /> Crear Usuario
                </button>
              </div>
            </div>

            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Registro</th>
                    <th>Ahorros</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(userData => (
                    <tr key={userData.id}>
                      <td>@{userData.username}</td>
                      <td>{userData.firstName} {userData.lastName}</td>
                      <td>
                        <span className={`role-badge ${userData.role}`}>
                          {userData.role === 'admin' ? 'Admin' : 'Usuario'}
                        </span>
                      </td>
                      <td>{new Date(userData.createdAt).toLocaleDateString()}</td>
                      <td>${(userData.stats?.totalSavings || 0).toLocaleString()}</td>
                      <td>
                        <span className="status-badge active">Activo</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon btn-info" 
                            title="Ver detalles"
                            onClick={() => {/* TODO: Implementar ver detalles */}}
                          >
                            <FaEye />
                          </button>
                          <button 
                            className="btn-icon btn-warning" 
                            title="Editar usuario"
                            onClick={() => handleEditUser(userData.id)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn-icon btn-danger" 
                            title="Eliminar usuario"
                            onClick={() => handleDeleteUser(userData.id)}
                            disabled={userData.id === user?.id} // No permitir eliminar a sí mismo
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="tickets-tab">
            <div className="tab-header">
              <h3>Gestión de Tickets</h3>
              <div className="tab-filters">
                <select>
                  <option value="">Todos los estados</option>
                  <option value="open">Abiertos</option>
                  <option value="in_progress">En progreso</option>
                  <option value="closed">Cerrados</option>
                </select>
              </div>
            </div>

            <div className="tickets-list">
              {tickets.map(ticket => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <div className="ticket-title">
                      {getStatusIcon(ticket.status)}
                      <h4>{ticket.title}</h4>
                    </div>
                    <div className="ticket-meta">
                      <span className="ticket-id">#{ticket.id.slice(-6)}</span>
                      <span className={`priority-badge ${ticket.priority}`}>
                        {ticket.priority === 'high' ? 'Alta' : 
                         ticket.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="ticket-body">
                    <p>{ticket.description}</p>
                    <div className="ticket-info">
                      <span>Por: {ticket.userName} (@{ticket.username})</span>
                      <span>Categoría: {ticket.category}</span>
                      <span>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="ticket-actions">
                    <select 
                      value={ticket.status}
                      onChange={(e) => handleTicketStatusUpdate(ticket.id, e.target.value)}
                      className={`status-select ${getStatusColor(ticket.status)}`}
                    >
                      <option value="open">Abierto</option>
                      <option value="in_progress">En progreso</option>
                      <option value="closed">Cerrado</option>
                    </select>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => openModal('ticketDetails', ticket.id)}
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h3>Configuración del Sistema</h3>
            <div className="settings-sections">
              <div className="settings-section">
                <h4>Configuración General</h4>
                <div className="settings-options">
                  <label>
                    <input type="checkbox" defaultChecked />
                    Permitir registro de nuevos usuarios
                  </label>
                  <label>
                    <input type="checkbox" defaultChecked />
                    Notificaciones por email
                  </label>
                  <label>
                    <input type="checkbox" />
                    Modo mantenimiento
                  </label>
                </div>
              </div>
              
              <div className="settings-section">
                <h4>Límites del Sistema</h4>
                <div className="settings-inputs">
                  <label>
                    Máximo de tickets por usuario por día:
                    <input type="number" defaultValue="5" />
                  </label>
                  <label>
                    Tiempo de sesión (horas):
                    <input type="number" defaultValue="24" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <CreateUserModal
        isOpen={modals.createUser}
        onClose={() => closeModal('createUser')}
        onSuccess={handleUserCreated}
      />

      <TicketDetailsModal
        isOpen={modals.ticketDetails}
        onClose={() => closeModal('ticketDetails')}
        ticketId={selectedTicketId}
      />

      <EditUserModal
        isOpen={modals.editUser}
        onClose={() => closeModal('editUser')}
        userId={selectedUserId}
        onSuccess={handleUserUpdated}
      />

      <DeleteUserModal
        isOpen={modals.deleteUser}
        onClose={() => closeModal('deleteUser')}
        userId={selectedUserId}
        onSuccess={handleUserDeleted}
      />
    </div>
  );
};

export default AdminDashboard;