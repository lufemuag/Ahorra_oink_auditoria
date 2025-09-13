import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ticketService } from '../../services/ticketService';
import { 
  FaTicketAlt, 
  FaPlus, 
  FaSearch,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaPaperPlane
} from 'react-icons/fa';
import './Support.css';

const Support = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-tickets');
  const [tickets, setTickets] = useState([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserTickets();
  }, []);

  const loadUserTickets = async () => {
    setLoading(true);
    try {
      const result = ticketService.getUserTickets();
      if (result.success) {
        setTickets(result.tickets);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = ticketService.createTicket(newTicket);
      
      if (result.success) {
        setTickets([result.ticket, ...tickets]);
        setNewTicket({
          title: '',
          description: '',
          category: 'technical',
          priority: 'medium'
        });
        setShowNewTicketForm(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Error al crear el ticket');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaExclamationTriangle className="status-icon open" />;
      case 'in_progress': return <FaClock className="status-icon in-progress" />;
      case 'closed': return <FaCheckCircle className="status-icon closed" />;
      default: return <FaTicketAlt className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En Progreso';
      case 'closed': return 'Cerrado';
      default: return 'Desconocido';
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'technical': return 'Técnico';
      case 'account': return 'Cuenta';
      case 'billing': return 'Facturación';
      case 'feature': return 'Solicitud de Función';
      case 'other': return 'Otro';
      default: return category;
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  return (
    <div className="support-page">
      {/* Header */}
      <div className="support-header">
        <h1>Centro de Soporte</h1>
        <p>¿Necesitas ayuda? Crea un ticket y nuestro equipo te asistirá.</p>
      </div>

      {/* Actions */}
      <div className="support-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowNewTicketForm(true)}
        >
          <FaPlus /> Crear Nuevo Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showNewTicketForm && (
        <div className="new-ticket-form">
          <div className="form-header">
            <h3>Crear Nuevo Ticket de Soporte</h3>
            <button 
              className="close-btn"
              onClick={() => {
                setShowNewTicketForm(false);
                setError('');
              }}
            >
              ×
            </button>
          </div>

          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleCreateTicket}>
            <div className="form-group">
              <label className="form-label">
                Título del Ticket *
              </label>
              <input
                type="text"
                className="form-input"
                value={newTicket.title}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                placeholder="Describe brevemente tu problema o solicitud"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Categoría
                </label>
                <select
                  className="form-input"
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                >
                  <option value="technical">Problema Técnico</option>
                  <option value="account">Problema de Cuenta</option>
                  <option value="billing">Facturación</option>
                  <option value="feature">Solicitud de Función</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Prioridad
                </label>
                <select
                  className="form-input"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Descripción Detallada *
              </label>
              <textarea
                className="form-textarea"
                rows="5"
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                placeholder="Describe detalladamente tu problema o solicitud. Incluye pasos para reproducir el problema si aplica."
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={() => {
                  setShowNewTicketForm(false);
                  setError('');
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="loader small"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Crear Ticket
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="tickets-section">
        <div className="section-header">
          <h3>Mis Tickets de Soporte</h3>
          <div className="tickets-stats">
            <span className="stat">
              Total: {tickets.length}
            </span>
            <span className="stat">
              Abiertos: {tickets.filter(t => t.status === 'open').length}
            </span>
            <span className="stat">
              En progreso: {tickets.filter(t => t.status === 'in_progress').length}
            </span>
          </div>
        </div>

        {loading && tickets.length === 0 ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>Cargando tus tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="empty-state">
            <FaTicketAlt className="empty-icon" />
            <h3>No tienes tickets de soporte</h3>
            <p>Cuando necesites ayuda, puedes crear un nuevo ticket usando el botón de arriba.</p>
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map(ticket => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-title">
                    {getStatusIcon(ticket.status)}
                    <div className="title-info">
                      <h4>{ticket.title}</h4>
                      <span className="ticket-id">#{ticket.id.slice(-6)}</span>
                    </div>
                  </div>
                  
                  <div className="ticket-badges">
                    <span className={`status-badge ${ticket.status}`}>
                      {getStatusText(ticket.status)}
                    </span>
                    <span className={`priority-badge ${ticket.priority}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                  </div>
                </div>

                <div className="ticket-body">
                  <p>{ticket.description}</p>
                  
                  <div className="ticket-meta">
                    <span>Categoría: {getCategoryText(ticket.category)}</span>
                    <span>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    <span>Actualizado: {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                    {ticket.responses && ticket.responses.length > 0 && (
                      <span>Respuestas: {ticket.responses.length}</span>
                    )}
                  </div>
                </div>

                <div className="ticket-actions">
                  <button className="btn btn-outline btn-sm">
                    Ver Detalles
                  </button>
                  {ticket.status !== 'closed' && (
                    <button className="btn btn-secondary btn-sm">
                      Agregar Comentario
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="help-section">
        <h3>¿Necesitas ayuda inmediata?</h3>
        <div className="help-options">
          <div className="help-card">
            <h4>Preguntas Frecuentes</h4>
            <p>Consulta nuestras preguntas más comunes y sus respuestas.</p>
            <button className="btn btn-outline btn-sm">Ver FAQ</button>
          </div>
          
          <div className="help-card">
            <h4>Guías de Usuario</h4>
            <p>Aprende a usar todas las funciones de Ahorra Oink.</p>
            <button className="btn btn-outline btn-sm">Ver Guías</button>
          </div>
          
          <div className="help-card">
            <h4>Contacto Directo</h4>
            <p>Para problemas urgentes, contáctanos directamente.</p>
            <button className="btn btn-outline btn-sm">Contactar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;